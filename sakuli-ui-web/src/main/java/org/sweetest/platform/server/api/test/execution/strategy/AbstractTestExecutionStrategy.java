package org.sweetest.platform.server.api.test.execution.strategy;

import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStopEvent;
import org.sweetest.platform.server.service.sakuli.SakuliTestSuite;

public abstract class AbstractTestExecutionStrategy<T> implements TestExecutionStrategy<T> {
    protected T configuration;
    protected TestSuite testSuite;
    protected String workspace;
    protected TestExecutionSubject backChannel = new TestExecutionSubject();

    public AbstractTestExecutionStrategy() {
        backChannel.subscribe(e -> {
            if(e instanceof TestExecutionStopEvent) {
                stop();
            }
        });
    }

    protected Observer<TestExecutionEvent> invokeStopObserver(TestExecutionStrategy strategy) {
        return e -> {
          if(e instanceof TestExecutionStopEvent) {
              strategy.stop();
          }
        };
    }

    @Override
    public TestExecutionSubject getBackChannel() {
        return backChannel;
    }

    public void setTestSuite(SakuliTestSuite testSuite) {
        this.testSuite = testSuite;
    }

    @Override
    public void setTestSuite(TestSuite testSuite) {
        this.testSuite = testSuite;
    }

    @Override
    public TestSuite getTestSuite() {
        return testSuite;
    }

    @Override
    public void setConfiguration(T config) {
        configuration = config;
    }

    @Override
    public T getConfiguration() {
        return configuration;
    }

    @Override
    abstract public TestRunInfo execute(Observer<TestExecutionEvent> testExecutionEventObserver);

    @Override
    public String getWorkspace() {
        return workspace;
    }

    @Override
    public void setWorkspace(String workspace) {
        this.workspace = workspace;
    }
}
