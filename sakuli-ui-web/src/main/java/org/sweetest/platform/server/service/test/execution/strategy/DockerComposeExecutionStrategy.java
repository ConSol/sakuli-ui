package org.sweetest.platform.server.service.test.execution.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.common.process.LocalCommand;
import org.sweetest.platform.server.api.runconfig.DockerComposeExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestRunInfoPorts;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionErrorEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStopEvent;
import org.sweetest.platform.server.service.test.execution.config.dockercompose.DockerComposeModel;
import org.sweetest.platform.server.service.test.execution.config.dockercompose.DockerComposeParser;

import java.io.File;
import java.nio.file.NoSuchFileException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class DockerComposeExecutionStrategy extends AbstractTestExecutionStrategy<DockerComposeExecutionConfiguration> {

    private static final Logger log = LoggerFactory.getLogger(DockerComposeExecutionStrategy.class);

    private TestExecutionSubject subject = new TestExecutionSubject();

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;
    private LocalCommand command;
    private CommandExecutorRunnable executor;
    private String executionId;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        executionId = UUID.randomUUID().toString();
        subject.subscribe(testExecutionEventObserver);

        List<String> commands = new ArrayList<>();
        commands.add("docker-compose");

        File dockerComposeFile = getComposeFile();
        Optional<DockerComposeModel> dockerComposeModelOptional = DockerComposeParser.fromFile(dockerComposeFile);
        TestRunInfo tri = new TestRunInfo(executionId);
        if (!dockerComposeModelOptional.isPresent()) {
            subject.next(new TestExecutionErrorEvent(
                    "Could not determine docker-compose file",
                    executionId,
                    new NoSuchFileException(dockerComposeFile.getAbsolutePath())));

            return tri;
        } else {
            commands.add("-f");
            commands.add(dockerComposeFile.getAbsolutePath());
            commands.add("up");

            List<TestRunInfoPorts> ports =
                    dockerComposeModelOptional
                            .get()
                            .getServices().entrySet().stream()
                            .map(e -> {
                                TestRunInfoPorts trip = new TestRunInfoPorts();
                                e.getValue().getPorts().stream().filter(p -> p.getTarget() == 5901).findFirst().ifPresent(p -> {
                                    trip.setVnc(p.getPublished());
                                });
                                e.getValue().getPorts().stream().filter(p -> p.getTarget() == 6901).findFirst().ifPresent(p -> {
                                    trip.setWeb(p.getPublished());
                                });
                                return trip;
                            })
                            .collect(Collectors.toList());
            tri.setTestRunInfoPortList(ports);

            log.info(getConfiguration().getFile());

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder
                    .directory(Paths.get(rootDirectory, getTestSuite().getRoot()).toFile())
                    .command(commands);

            command = new LocalCommand(processBuilder);
            new Thread(() -> {
                executor = new CommandExecutorRunnable(
                        executionId,
                        command,
                        subject
                );
                executor.run();
            }).start();
            tri.subscribe(invokeStopObserver(this));
        }
        return tri;
    }

    private File getComposeFile() {
        String cfgFilePath = getConfiguration().getFile();
        File cfgFile = Paths.get(rootDirectory, getTestSuite().getRoot(), cfgFilePath).normalize().toFile();
        if (cfgFile.exists()) {
            return cfgFile;
        } else {
            File defaultFile = Paths.get(rootDirectory, getTestSuite().getRoot(), "docker-compose.yml").normalize().toFile();
            return defaultFile;
        }
    }

    public void stop() {
        if (executor != null) {
            executor.stop();
            subject.next(new TestExecutionStopEvent(executionId));
        }
    }

}
