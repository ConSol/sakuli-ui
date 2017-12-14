package org.sweetest.platform.server.service.test.execution.strategy;

import com.github.dockerjava.api.DockerClient;
import org.jooq.lambda.Unchecked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.common.process.LocalCommand;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.runconfig.LocalExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.common.*;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionLogEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStartEvent;

import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class LocalExecutionStrategy extends AbstractTestExecutionStrategy<LocalExecutionConfiguration> {

    private static Logger log = LoggerFactory.getLogger(LocalExecutionStrategy.class);

    private TestExecutionSubject subject = new TestExecutionSubject();

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        String executionId = UUID.randomUUID().toString();
        subject.subscribe(testExecutionEventObserver);
        ProcessBuilder processBuilder = new ProcessBuilder();
        Consumer<Map.Entry<String, String>> printE = e -> log.info(String.format("%s: %s", e.getKey(), e.getValue()));
        String sakuliHome = Optional
                .ofNullable(System.getenv("SAKULI_HOME"))
                .orElse("/Applications/sakuli/sakuli-v1.0.2");
        Map<String,String> pbEnv = processBuilder.environment();
        pbEnv.put("Path", pbEnv.get("Path") + ":" + sakuliHome + "/bin");
        pbEnv.put("GOOS", "linux");
        pbEnv.put("GOARCH", "386");
        processBuilder
                .directory(Paths.get(rootDirectory, getTestSuite().getName()).toFile())
                .command("/bin/bash", "-c", "-l", "sakuli run .");

        LocalCommand command = new LocalCommand(processBuilder);
        new Thread(new CommandExecutorRunnable(
                executionId,
                command,
                subject
        )).start();
        return new TestRunInfo(5901, 6901, executionId);
    }
}
