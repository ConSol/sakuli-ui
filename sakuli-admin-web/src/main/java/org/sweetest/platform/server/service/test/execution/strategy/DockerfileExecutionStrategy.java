package org.sweetest.platform.server.service.test.execution.strategy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.command.AttachContainerResultCallback;
import com.github.dockerjava.core.command.BuildImageResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
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
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.runconfig.DockerFileExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.common.*;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.*;

import java.io.File;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import static com.github.dockerjava.api.model.Ports.Binding.bindPort;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class DockerfileExecutionStrategy extends AbstractTestExecutionStrategy<DockerFileExecutionConfiguration> {

    private static Logger log = LoggerFactory.getLogger(DockerfileExecutionStrategy.class);
    public static final String INTERNAL_READY_TO_RUN = "internal.ready-to-run";

    private TestExecutionSubject subject = new TestExecutionSubject();
    private String executionId;

    private TestExecutionEvent readyToRun;

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;

    @Autowired
    private DockerClient dockerClient;

    @Autowired
    private FileSystemService fileSystemService;
    private String mountPath;
    private Volume volume;
    private ExposedPort vncPort;
    private ExposedPort vncWebPort;
    private Ports ports;
    private CreateContainerResponse container;
    private SakuliEventResultCallback eventsResultCallback;

    @Value("${docker.userid:1000}")
    private String dockerUserId;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        subject.subscribe(testExecutionEventObserver);
        executionId = UUID.randomUUID().toString();
        eventsResultCallback = new SakuliEventResultCallback(executionId, subject, dockerClient);
        readyToRun = new TestExecutionEvent(INTERNAL_READY_TO_RUN, "", executionId);
        mountPath = ("/" + getWorkspace()).replace("//", "/");
        volume = new Volume(mountPath);
        vncPort = ExposedPort.tcp(5901);
        vncWebPort = ExposedPort.tcp(6901);
        ports = new Ports();
        int availableVncPort = SocketUtils.findAvailableTcpPort(5901, 6900);
        int availableVncWebPort = SocketUtils.findAvailableTcpPort(6901);
        ports.bind(vncPort, bindPort(availableVncPort));
        ports.bind(vncWebPort, bindPort(availableVncWebPort));

        Optional<File> maybeFile = fileSystemService.getFileFromPath(
                testSuite.getRoot(),
                getConfiguration().getFile());
        if (maybeFile.isPresent()) {
            new Thread(() -> {
                File file = maybeFile.get();
                next(new DockerPullStartedEvent(executionId));
                try {
                    String imageId = dockerClient
                            .buildImageCmd(file)
                            .exec(new BuildImageResultCallback() {
                                @Override
                                public void onNext(BuildResponseItem item) {
                                    ObjectMapper mapper = new ObjectMapper();
                                    try {
                                        String buildResponse = mapper.writeValueAsString(item);
                                        next(new DockerPullProgressEvent(executionId, buildResponse));
                                    } catch (JsonProcessingException e) {
                                        e.printStackTrace();
                                    }
                                    super.onNext(item);
                                }

                                @Override
                                public void onComplete() {
                                    next(new DockerPullCompletedEvent(executionId));
                                    super.onComplete();
                                }
                            }).awaitImageId();
                    createContainer(imageId);
                    startContainer();
                    attachToContainer();
                } catch(Exception e) {
                    next(new TestExecutionErrorEvent(e.getMessage(), executionId));
                }
            }).start();
            return new TestRunInfo(
                    availableVncPort, availableVncWebPort, executionId
            );
        } else {
            return new TestRunInfo(-1, -1, "");
        }
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

    private void createContainer(String id) {
        container = dockerClient
                .createContainerCmd(id)
                .withCmd("run", "/" + testSuite.getRoot())
                .withExposedPorts(vncPort, vncWebPort)
                .withPortBindings(ports)
                .withUser(dockerUserId)
                .withPublishAllPorts(true)
                .withVolumes(volume)
                .withBinds(new Bind(Paths.get(rootDirectory, mountPath).toString(), volume))
                .exec();
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

    void next(TestExecutionEvent event) {
        subject.next(event);
    }
}
