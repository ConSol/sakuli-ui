package org.sweetest.platform.server.service.test.execution.strategy;

import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.runconfig.DockerComposeExecutionConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.execution.strategy.AbstractTestExecutionStrategy;
import org.sweetest.platform.server.api.test.execution.strategy.Observer;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

@Service()
public class DockerComposeExecutionStrategy extends AbstractTestExecutionStrategy<DockerComposeExecutionConfiguration> {

    @Override
    public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver) {
        return null;
    }
}
