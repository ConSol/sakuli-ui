package org.sweetest.platform.server.service.test.execution.strategy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.command.AttachContainerResultCallback;
import com.github.dockerjava.core.command.PullImageResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.util.SocketUtils;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.runconfig.SakuliExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.*;
import org.sweetest.platform.server.api.common.*;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import static com.github.dockerjava.api.model.Ports.Binding.bindPort;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class SakuliContainerStrategy extends AbstractTestExecutionStrategy<SakuliExecutionConfiguration> {

    private static final Logger log = LoggerFactory.getLogger(SakuliContainerStrategy.class);
    private static final String INTERNAL_READY_TO_RUN = "internal.ready-to-run";

    @Autowired
    private DockerClient dockerClient;

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;

    private String mountPath;
    private Volume volume;
    private ExposedPort vncPort;
    private ExposedPort vncWebPort;
    private Ports ports;
    private int availableVncPort;
    private int availableVncWebPort;
    private TestExecutionSubject subject = new TestExecutionSubject();

    private SakuliEventResultCallback eventsResultCallback;

    private CreateContainerResponse container;
    private String executionId;
    private String containerToRunWithoutTag;
    private String containerToRunWithTag;

    private TestExecutionEvent readyToRun;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        subject.subscribe(testExecutionEventObserver);
        subject.subscribe(e -> {
            if (e.equals(readyToRun)) {
                createContainer();
                startContainer();
                attachToContainer();
            }
        });
        executionId = UUID.randomUUID().toString();
        eventsResultCallback = new SakuliEventResultCallback(executionId, subject, dockerClient);
        readyToRun = new TestExecutionEvent(INTERNAL_READY_TO_RUN, "", executionId);
        mountPath = ("/" + getWorkspace()).replace("//", "/");
        volume = new Volume(mountPath);
        vncPort = ExposedPort.tcp(5901);
        vncWebPort = ExposedPort.tcp(6901);
        ports = new Ports();
        availableVncPort = SocketUtils.findAvailableTcpPort(5901, 6900);
        availableVncWebPort = SocketUtils.findAvailableTcpPort(6901);
        ports.bind(vncPort, bindPort(availableVncPort));
        ports.bind(vncWebPort, bindPort(availableVncWebPort));
        containerToRunWithoutTag = String.format("%s/%s",
                configuration.getContainer().getNamespace(),
                configuration.getContainer().getName()
        );
        containerToRunWithTag = String.format("%s:%s",
                containerToRunWithoutTag,
                configuration.getTag().getName()
        );

        if (isPullingRequired()) {
            pullImage();
        } else {
            log.info(String.format("Image %s already exists", containerToRunWithTag));
            next(readyToRun);
        }

        return new TestRunInfo(
                availableVncPort,
                availableVncWebPort,
                executionId
        );

    }

    private boolean isPullingRequired() {
        return dockerClient.listImagesCmd()
                .withImageNameFilter(containerToRunWithTag)
                .exec()
                .isEmpty();
    }

    private void pullImage() {
        log.info(String.format("Image %s not found, try to pull it", containerToRunWithTag));
        subject.next(new DockerPullStartedEvent(executionId));
        dockerClient
                .pullImageCmd(containerToRunWithoutTag)
                .withTag(configuration.getTag().getName())
                .exec(new PullImageResultCallback() {
                    @Override
                    public void onNext(PullResponseItem item) {
                        //log.info("PullImageResultCallback:" + ReflectionToStringBuilder.toString(item));
                        ObjectMapper mapper = new ObjectMapper();
                        try {
                            String pullResponse = mapper.writeValueAsString(item);
                            next(new DockerPullProgressEvent(executionId, pullResponse));
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                        super.onNext(item);
                    }

                    @Override
                    public void onComplete() {
                        next(readyToRun);
                        next(new DockerPullCompletedEvent(executionId));
                        super.onComplete();
                    }
                });
    }

    private void attachToContainer() {
        dockerClient
                .logContainerCmd(container.getId())
                .withStdOut(true)
                .withStdErr(true)
                .withTailAll()
                .withFollowStream(true)
                .exec(new AttachContainerResultCallback() {
                    @Override
                    public void onNext(Frame item) {
                        next(new TestExecutionLogEvent(
                                        executionId,
                                        new String(item.getPayload())
                                )
                        );
                        super.onNext(item);
                    }
                });
    }

    private void startContainer() {
        dockerClient.eventsCmd().exec(eventsResultCallback);
        //subject.next(new TestExecutionStartEvent(executionId));
        dockerClient.startContainerCmd(container.getId()).exec();
        Optional.ofNullable(container.getWarnings()).map(ReflectionToStringBuilder::toString)
                .ifPresent(w -> {
                    log.warn(w);
                    next(new TestExecutionEvent(TestExecutionEvent.TYPE_WARNING, w, executionId));
                });
    }

    private void createContainer() {
        container = dockerClient
                .createContainerCmd(containerToRunWithTag)
                .withCmd("run", "/" + testSuite.getRoot())
                .withExposedPorts(vncPort, vncWebPort)
                .withPortBindings(ports)
                .withPublishAllPorts(true)
                .withVolumes(volume)
                .withBinds(new Bind(Paths.get(rootDirectory, mountPath).toString(), volume))
                .exec();
    }

    void next(TestExecutionEvent event) {
        subject.next(event);
    }
}
