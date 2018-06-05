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
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionErrorEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStopEvent;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;

import static org.apache.commons.lang.StringUtils.isEmpty;
import static org.sweetest.platform.server.service.test.execution.config.SakuliLocalExecutionConfig.SAKULI_HOME_FOLDER;
import static org.sweetest.platform.server.service.test.execution.config.SakuliLocalExecutionConfig.SAKULI_HOME_FOLDER_ENV;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class SakuliLocalExecutionStrategy extends AbstractTestExecutionStrategy<LocalExecutionConfiguration> {

    private static Logger log = LoggerFactory.getLogger(SakuliLocalExecutionStrategy.class);

    private TestExecutionSubject subject = new TestExecutionSubject();

    @Autowired
    @Qualifier("rootDirectory")
    private String rootDirectory;
    @Autowired
    @Qualifier("sakuliHome")
    private String sakuliHome;
    private CommandExecutorRunnable executor;
    private String executionId;

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        try {
            executionId = "local-" + UUID.randomUUID().toString();
            subject.subscribe(testExecutionEventObserver);
            ProcessBuilder processBuilder = new ProcessBuilder();
            Consumer<Map.Entry<String, String>> printE = e -> log.info(String.format("%s: %s", e.getKey(), e.getValue()));
            if (isEmpty(sakuliHome) || Files.notExists(Paths.get(sakuliHome))) {
                throw new FileNotFoundException("Couldn't resolve local Sakuli executable!" +
                        "Please check property '" + SAKULI_HOME_FOLDER + "'" +
                        "or environment variable '" + SAKULI_HOME_FOLDER_ENV + "'.");
            }
            Map<String, String> pbEnv = processBuilder.environment();
            pbEnv.put("Path", pbEnv.get("Path") + ":" + Paths.get(sakuliHome, "bin").toString());
            final Path testSuitePath = Paths.get(rootDirectory, getTestSuite().getName());
            log.info("{} run testsuite: {}", executionId, testSuitePath);
            processBuilder
                    .directory(Paths.get(".").toFile())
                    .command("sakuli", "run", testSuitePath.toString());

            LocalCommand command = new LocalCommand(processBuilder);
            runDetached(() -> {
                executor = new CommandExecutorRunnable(
                        executionId,
                        command,
                        subject
                );
                executor.run();
            });

        } catch (Exception e) {
            //TODO check why not block execution in UI and shows error message
            log.error(e.getClass().getSimpleName(), e);
            subject.next(new TestExecutionErrorEvent(e.getMessage(), executionId, e));
        }
        //TODO use Int and nulls to prevent showing VNC ports on local execution
        TestRunInfo tri = new TestRunInfo("localhost", 5901, 6901, executionId);
        tri.subscribe(invokeStopObserver(this));
        return tri;
    }

    public void stop() {
        if (executor != null) {
            executor.stop();
            subject.next(new TestExecutionStopEvent(executionId));
        }
    }

}
