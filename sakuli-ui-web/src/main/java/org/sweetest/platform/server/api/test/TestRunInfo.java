package org.sweetest.platform.server.api.test;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;

import java.util.ArrayList;
import java.util.List;

public class TestRunInfo extends TestExecutionSubject {

    private String containerId;

    private List<TestRunInfoPorts> testRunInfoPortList = new ArrayList<>();

    public TestRunInfo(String containerId) {
        this.containerId = containerId;
    }

    public TestRunInfo(int vncPort, int vncWebPort, String containerId) {
        this.addTestRunInfoPorts(vncPort, vncWebPort);
        this.containerId = containerId;
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

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }
}
