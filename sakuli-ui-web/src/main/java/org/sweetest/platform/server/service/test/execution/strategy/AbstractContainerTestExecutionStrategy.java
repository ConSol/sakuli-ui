package org.sweetest.platform.server.service.test.execution.strategy;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.command.AttachContainerResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.SocketUtils;
import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionErrorEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionLogEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStartEvent;

import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import static com.github.dockerjava.api.model.Ports.Binding.bindPort;
import static org.sweetest.platform.server.ApplicationConfig.DOCKER_CONTAINER_SAKULI_UI_USER;

public abstract class AbstractContainerTestExecutionStrategy<T> extends AbstractTestExecutionStrategy<T> {
    private static final Logger log = LoggerFactory.getLogger(AbstractContainerTestExecutionStrategy.class);

    @Autowired
    protected DockerClient dockerClient;
    @Autowired
    @Qualifier("rootDirectory")
    protected String rootDirectory;
    @Value("${docker.userid:1000}")
    protected String dockerUserId;

    protected TestExecutionSubject subject;
    protected CreateContainerResponse containerReference;
    protected String executionId;
    protected AttachContainerResultCallback callback;
    protected ExposedPort vncPort;
    protected ExposedPort vncWebPort;
    protected Ports ports;

    public AbstractContainerTestExecutionStrategy() {
        this.subject = new TestExecutionSubject();
    }

    void next(TestExecutionEvent event) {
        subject.next(event);
    }

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        int availableVncPort = SocketUtils.findAvailableTcpPort(5901, 6900);
        int availableVncWebPort = SocketUtils.findAvailableTcpPort(6901);
        try {
            subject.subscribe(testExecutionEventObserver);
            executionId = createExecutionId();

            vncPort = ExposedPort.tcp(5901);
            vncWebPort = ExposedPort.tcp(6901);
            ports = new Ports();
            ports.bind(vncPort, bindPort(availableVncPort));
            ports.bind(vncWebPort, bindPort(availableVncWebPort));

            executeContainerStrategy();
        } catch (Exception e) {
            //TODO show TestExecutionErrorEvent on UI
            next(new TestExecutionErrorEvent(e.getMessage(), executionId, e));
        }
        final TestRunInfo tri = new TestRunInfo(
                availableVncPort,
                availableVncWebPort,
                executionId
        );
        tri.subscribe(invokeStopObserver(this));
        return tri;

    }

    /**
     * Have to implement for different container based strategies
     */
    protected abstract void executeContainerStrategy();

    /**
     * Creates a basic container configuration
     *
     * @param containerImageName
     * @return {@link CreateContainerCmd} for execution
     */
    protected CreateContainerCmd createContainerConfig(String containerImageName) {
        final String testSuitePath = Paths.get(rootDirectory, testSuite.getRoot()).toString();
        final CreateContainerCmd basicContainerCmd = dockerClient
                .createContainerCmd(containerImageName)
                .withExposedPorts(vncPort, vncWebPort)
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
                    .withUser(dockerUserId)
                    .withVolumes(volume)
                    .withBinds(new Bind(testSuitePath, volume));
        }
        log.info("Container configuration created for test suite '{}'", testSuitePath);
        return basicContainerCmd;
    }

    protected void startContainer() {
        log.info("Start pre-configured container for execution ID '{}'", executionId);
        dockerClient.eventsCmd().exec(new SakuliEventResultCallback(executionId, subject, dockerClient));
        subject.next(new TestExecutionStartEvent(executionId));
        dockerClient.startContainerCmd(containerReference.getId())
                .exec();
        Optional.ofNullable(containerReference.getWarnings()).map(ReflectionToStringBuilder::toString)
                .ifPresent(w -> {
                    log.warn(w);
                    next(new TestExecutionEvent(TestExecutionEvent.TYPE_WARNING, w, executionId));
                });
    }

    protected void attachToContainer() {
        callback = dockerClient
                .logContainerCmd(containerReference.getId())
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

    protected String createExecutionId() {
        return UUID.randomUUID().toString();
    }

    @Override
    public void stop() {
        if (containerReference != null && containerReference.getId() != null) {
            log.info("Will stop containers " + containerReference.getId());
            try {
                if (callback != null) {
                    callback.close();
                }
                dockerClient
                        .killContainerCmd(containerReference.getId())
                        .withSignal("9")
                        .exec();
                containerReference = null;
            } catch (Exception e) {
                e.printStackTrace();
                next(new TestExecutionErrorEvent("Cannot stop containers " + containerReference.getId(), executionId, e));
            }
        } else {
            next(new TestExecutionLogEvent("no-container-id", "Cannot stop container: no container is started!"));
        }
    }
}
