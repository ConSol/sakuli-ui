package org.sweetest.platform.server.service.test.execution;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionStrategy;

import java.util.Optional;

@Service
public class TestExecutionStrategyFactory {

    private static final Logger log = LoggerFactory.getLogger(TestExecutionStrategyFactory.class);

    @Autowired
    TestExecutionStrategy sakuliContainerStrategy;

    @Autowired
    TestExecutionStrategy localExecutionStrategy;

    @Autowired
    TestExecutionStrategy dockerfileExecutionStrategy;

    @Autowired
    TestExecutionStrategy dockerComposeExecutionStrategy;


    public Optional<TestExecutionStrategy> getStrategyByRunConfiguration(final RunConfiguration runConfiguration) {
        switch (runConfiguration.getType()) {
            case SakuliContainer:
                sakuliContainerStrategy.setConfiguration(runConfiguration.getSakuli());
                return Optional.of(sakuliContainerStrategy);
            case DockerCompose:
                dockerComposeExecutionStrategy.setConfiguration(runConfiguration.getDockerCompose());
                return Optional.of(dockerComposeExecutionStrategy);
            case Dockerfile:
                dockerfileExecutionStrategy.setConfiguration(runConfiguration.getDockerfile());
                return Optional.of(dockerfileExecutionStrategy);
            case Local:
                localExecutionStrategy.setConfiguration(runConfiguration.getLocal());
                return Optional.of(localExecutionStrategy);
        }
        return Optional.empty();
    }


}
