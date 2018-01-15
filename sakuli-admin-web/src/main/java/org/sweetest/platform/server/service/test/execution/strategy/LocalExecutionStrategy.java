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
import org.sweetest.platform.server.api.runconfig.LocalExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;

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
                //TODO throw error to the client
                .orElse("/Applications/sakuli/sakuli-v1.0.2");
        Map<String,String> pbEnv = processBuilder.environment();
        pbEnv.put("Path", pbEnv.get("Path") + ":" + sakuliHome + "/bin");
        processBuilder
                .directory(Paths.get(rootDirectory, getTestSuite().getName()).toFile())
                .command("sakuli","run", ".");

        LocalCommand command = new LocalCommand(processBuilder);
        new Thread(new CommandExecutorRunnable(
                executionId,
                command,
                subject
        )).start();
        return new TestRunInfo(5901, 6901, executionId);
    }

    public void stop() {
        log.info("Will stop container");
    }

}
