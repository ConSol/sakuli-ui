package org.sweetest.platform.server.api.test.execution.strategy;

import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestSuite;

public interface TestExecutionStrategy<T> {

    void setTestSuite(TestSuite testSuite);
    TestSuite getTestSuite();

    void setWorkspace(String workspace);
    String getWorkspace();

    void setConfiguration(T config);
    T getConfiguration();

    TestExecutionSubject getBackChannel();

    TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver);

    void stop();
}
