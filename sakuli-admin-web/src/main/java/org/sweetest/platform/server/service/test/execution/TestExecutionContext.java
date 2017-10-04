package org.sweetest.platform.server.service.test.execution;

import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.common.*;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionStrategy;

@Service
public class TestExecutionContext {

    TestExecutionStrategy strategy;

    public TestExecutionStrategy getStrategy() {
        return strategy;
    }

    public void setStrategy(TestExecutionStrategy strategy) {
        this.strategy = strategy;
    }

    public TestRunInfo executeStrategy(TestSuite testSuite, Observer<TestExecutionEvent> testExecutionEventObserver) {
        this.strategy.setTestSuite(testSuite);
        return strategy.execute(testExecutionEventObserver);
    }
}
