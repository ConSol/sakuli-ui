package org.sweetest.platform.server.api.test;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;

import java.util.ArrayList;
import java.util.List;

public class TestRunInfo extends TestExecutionSubject {

    private String executionId;

    private List<TestRunInfoPorts> testRunInfoPortList = new ArrayList<>();

    public TestRunInfo(String executionId) {
        this.executionId = executionId;
    }

    public TestRunInfo(int vncPort, int vncWebPort, String executionId) {
        this.addTestRunInfoPorts(vncPort, vncWebPort);
        this.executionId = executionId;
    }

    public List<TestRunInfoPorts> getTestRunInfoPortList() {
        return testRunInfoPortList;
    }

    public void setTestRunInfoPortList(List<TestRunInfoPorts> testRunInfoPortList) {
        this.testRunInfoPortList = testRunInfoPortList;
    }

    public void addTestRunInfoPorts(int vnc, int web) {
        testRunInfoPortList.add(new TestRunInfoPorts(vnc, web));
    }

    public void addTestRunInfoPorts(TestRunInfoPorts testRunInfoPort) {
        testRunInfoPortList.add(testRunInfoPort);
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }
}
