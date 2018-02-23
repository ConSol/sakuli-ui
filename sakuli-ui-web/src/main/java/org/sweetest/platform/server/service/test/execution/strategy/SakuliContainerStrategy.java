package org.sweetest.platform.server.service.test.execution.strategy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.command.AttachContainerResultCallback;
import com.github.dockerjava.core.command.PullImageResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.util.SocketUtils;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.runconfig.SakuliExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.*;

import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.github.dockerjava.api.model.Ports.Binding.bindPort;
import static org.sweetest.platform.server.ApplicationConfig.DOCKER_CONTAINER_SAKULI_UI_USER;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class SakuliContainerStrategy extends AbstractTestExecutionStrategy<SakuliExecutionConfiguration> {

    private static final Logger log = LoggerFactory.getLogger(SakuliContainerStrategy.class);
    private static final String INTERNAL_READY_TO_RUN = "internal.ready-to-run";
    @Value("${docker.userid:1000}")
    private String dockerUserId;

    @Autowired
    private DockerClient dockerClient;

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;

    private ExposedPort vncPort;
    private ExposedPort vncWebPort;
    private Ports ports;
    private int availableVncPort;
    private int availableVncWebPort;
    private TestExecutionSubject subject = new TestExecutionSubject();

    private SakuliEventResultCallback eventsResultCallback;

    private CreateContainerResponse runningContainer;
    private String executionId;
    private String containerToRunWithoutTag;
    private String containerToRunWithTag;

    private TestExecutionEvent readyToRun;
    private AttachContainerResultCallback callback;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        subject.subscribe(testExecutionEventObserver);
        subject.subscribe(e -> {
            if (e.equals(readyToRun)) {
                runningContainer = createContainer();
                startContainer(runningContainer);
                Info i = dockerClient.infoCmd().exec();
                InspectContainerResponse response = dockerClient.inspectContainerCmd(runningContainer.getId())
                        .exec();
                log.info(
                        ReflectionToStringBuilder.toString(response, ToStringStyle.MULTI_LINE_STYLE)
                                + ReflectionToStringBuilder.toString(i, ToStringStyle.MULTI_LINE_STYLE)
                );
                attachToContainer(runningContainer);
            }
            //TODO show TestExecutionErrorEvent on UI
        });
        executionId = UUID.randomUUID().toString();
        eventsResultCallback = new SakuliEventResultCallback(executionId, subject, dockerClient);
        readyToRun = new TestExecutionEvent(INTERNAL_READY_TO_RUN, "", executionId);
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
        try {
            if (isPullingRequired()) {
                pullImage();
            } else {
                log.info(String.format("Image %s already exists", containerToRunWithTag));
                next(readyToRun);
            }
        } catch (Exception e) {
            log.error(e.getClass().getSimpleName(), e);
            subject.next(new TestExecutionErrorEvent(e.getMessage(), executionId, e));
        }

        final TestRunInfo tri = new TestRunInfo(
                availableVncPort,
                availableVncWebPort,
                executionId
        );
        tri.subscribe(invokeStopObserver(this));
        return tri;
    }

    public void stop() {
        if (runningContainer != null && runningContainer.getId() != null) {
            log.info("Will stop containers " + runningContainer.getId());
            try {
                if (callback != null) {
                    callback.close();
                }
                dockerClient
                        .killContainerCmd(runningContainer.getId())
                        .withSignal("9")
                        .exec();
                runningContainer = null;
            } catch (Exception e) {
                e.printStackTrace();
                next(new TestExecutionErrorEvent("Cannot stop containers " + runningContainer.getId(), executionId, e));
            }
        } else {
            next(new TestExecutionLogEvent("no-container-id", "Cannot stop container: no container is started!"));
        }
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

    private void attachToContainer(CreateContainerResponse container) {
        callback = dockerClient
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

    private void startContainer(CreateContainerResponse container) {
        dockerClient.eventsCmd().exec(eventsResultCallback);
        subject.next(new TestExecutionStartEvent(executionId));
        dockerClient.startContainerCmd(container.getId())
                .exec();
        Optional.ofNullable(container.getWarnings()).map(ReflectionToStringBuilder::toString)
                .ifPresent(w -> {
                    log.warn(w);
                    next(new TestExecutionEvent(TestExecutionEvent.TYPE_WARNING, w, executionId));
                });
    }

    private CreateContainerResponse createContainer() {
        final String testSuitePath = Paths.get(rootDirectory, testSuite.getRoot()).toString();
        final CreateContainerCmd basicContainerCmd = dockerClient
                .createContainerCmd(containerToRunWithTag)
                .withExposedPorts(vncPort, vncWebPort)
                .withEnv(getEnvFromConfig())
                .withPortBindings(ports)
                .withPublishAllPorts(true)
                .withCmd("run", testSuitePath);

        if (System.getenv().containsKey(DOCKER_CONTAINER_SAKULI_UI_USER)) {
            //Sakuli UI is running in container itself -> start "docker-in-docker" container
            basicContainerCmd
                    .withUser(System.getenv(DOCKER_CONTAINER_SAKULI_UI_USER))
                    //ID of docker-ui-container is set on HOSTNAME
                    .withVolumesFrom(new VolumesFrom(System.getenv("HOSTNAME"), AccessMode.rw));
        } else {
            final Volume volume = new Volume(testSuitePath);
            basicContainerCmd
                    .withVolumes(volume)
                    .withBinds(new Bind(testSuitePath, volume));
        }
        return basicContainerCmd.exec();
    }

    private List<String> getEnvFromConfig() {
        return this.getConfiguration().getEnvironment().stream()
                .map(p -> String.format("%s=%s", p.getKey(), p.getValue()))
                .collect(Collectors.toList());
    }

    void next(TestExecutionEvent event) {
        subject.next(event);
    }
}
