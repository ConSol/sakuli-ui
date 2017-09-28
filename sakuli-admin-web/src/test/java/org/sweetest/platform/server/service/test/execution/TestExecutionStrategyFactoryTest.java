package org.sweetest.platform.server.service.test.execution;

import org.assertj.core.internal.cglib.core.Local;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.sweetest.platform.server.Application;
import org.sweetest.platform.server.api.runconfig.ExecutionTypes;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionStrategy;

import java.util.Optional;
import java.util.function.Predicate;

import static org.testng.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class TestExecutionStrategyFactoryTest {

    RunConfiguration runConfiguration = new RunConfiguration();

    @Autowired
    TestExecutionStrategy dockerfileExecutionStrategy;

    @Autowired
    TestExecutionStrategy sakuliContainerStrategy;

    @Autowired
    TestExecutionStrategy localExecutionStrategy;

    @Autowired
    TestExecutionStrategy dockerComposeExecutionStrategy;

    @Autowired
    TestExecutionStrategyFactory strategyFactory;

    @Test
    public void testGetStrategyByRunConfigurationForLocal() throws Exception {
        testRunner(
                ExecutionTypes.Local,
                localExecutionStrategy,
                s -> s.getConfiguration().equals(runConfiguration.getLocal())
        );
    }

    @Test
    public void testGetStrategyByRunConfigurationForDockerfile() throws Exception {
        testRunner(
                ExecutionTypes.Dockerfile,
                dockerfileExecutionStrategy,
                s -> s.getConfiguration().equals(runConfiguration.getDockerfile())
        );
    }

    @Test
    public void testGetStrategyByRunConfigurationForDockerCompose() throws Exception {
        testRunner(
                ExecutionTypes.DockerCompose,
                dockerComposeExecutionStrategy,
                s -> s.getConfiguration().equals(runConfiguration.getDockerCompose())
        );
    }

    @Test
    public void testGetStrategyByRunConfigurationForSakuli() throws Exception {
        testRunner(
                ExecutionTypes.SakuliContainer,
                sakuliContainerStrategy,
                s -> s.getConfiguration().equals(runConfiguration.getSakuli())
        );
    }

    private void testRunner(ExecutionTypes types, TestExecutionStrategy strategy, Predicate<TestExecutionStrategy> validateConfig) {
        runConfiguration.setType(types);
        Optional<TestExecutionStrategy> mayBeStrategy = strategyFactory.getStrategyByRunConfiguration(runConfiguration);
        assertTrue(mayBeStrategy.isPresent(), "A Strategy is created / found");
        TestExecutionStrategy someStrategy = mayBeStrategy.get();
        assertEquals(someStrategy, strategy, "Created / found Strategy is from list");
        assertTrue(validateConfig.test(someStrategy), "Configuration is set to create strategy");
    }

}