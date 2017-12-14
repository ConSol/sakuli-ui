package org.sweetest.platform.server.service.test.execution.strategy;

import org.jooq.lambda.Unchecked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.common.process.LocalCommand;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.runconfig.DockerComposeExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.common.*;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionLogEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStartEvent;

import java.io.File;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class DockerComposeExecutionStrategy extends AbstractTestExecutionStrategy<DockerComposeExecutionConfiguration> {

    private TestExecutionSubject subject = new TestExecutionSubject();

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        String executionId = UUID.randomUUID().toString();
        subject.subscribe(testExecutionEventObserver);
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder
                .directory(Paths.get(rootDirectory, getTestSuite().getRoot()).toFile())
                .command("docker-compose", "up");

        LocalCommand command = new LocalCommand(processBuilder);
        new Thread(new CommandExecutorRunnable(
                executionId,
                command,
                subject
        )).start();
        return new TestRunInfo(5901, 6901, executionId);
    }
}
