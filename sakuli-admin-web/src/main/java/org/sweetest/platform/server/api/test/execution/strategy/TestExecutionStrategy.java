package org.sweetest.platform.server.api.test.execution.strategy;

import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.common.*;

public interface TestExecutionStrategy<T> {

    void setTestSuite(TestSuite testSuite);
    TestSuite getTestSuite();

    void setConfiguration(T config);
    T getConfiguration();

    TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver);
}
