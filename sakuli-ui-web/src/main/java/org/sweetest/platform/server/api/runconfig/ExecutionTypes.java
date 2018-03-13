package org.sweetest.platform.server.api.runconfig;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionStrategy;
import org.sweetest.platform.server.service.test.execution.strategy.DockerComposeExecutionStrategy;
import org.sweetest.platform.server.service.test.execution.strategy.DockerfileExecutionStrategy;
import org.sweetest.platform.server.service.test.execution.strategy.SakuliContainerStrategy;
import org.sweetest.platform.server.service.test.execution.strategy.SakuliLocalExecutionStrategy;

public enum ExecutionTypes {

    Local(SakuliLocalExecutionStrategy.class),
    Dockerfile(DockerfileExecutionStrategy.class),
    DockerCompose(DockerComposeExecutionStrategy.class),
    SakuliContainer(SakuliContainerStrategy.class);

    private Class strategyClass;
    ExecutionTypes(Class strategyClass) {
        if(TestExecutionStrategy.class.isAssignableFrom(strategyClass)) {
            this.strategyClass = strategyClass;
        } else {
            throw new RuntimeException(strategyClass.getName() + " is not a " + TestExecutionStrategy.class.getName());
        }
    }

    public Class<TestExecutionStrategy> getStrategyClass() {
        return strategyClass;
    }

    @Override
    public String toString() {
        return name();
    }
}
