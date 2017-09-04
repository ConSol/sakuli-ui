package org.sweetest.platform.server.api.test;

public class TestRunInfo {

    private int vncPort;
    private int vncWebPort;
    private String containerId;

    public TestRunInfo(int vncPort, int vncWebPort, String containerId) {
        this.vncPort = vncPort;
        this.vncWebPort = vncWebPort;
        this.containerId = containerId;
    }

    public int getVncPort() {
        return vncPort;
    }

    public void setVncPort(int vncPort) {
        this.vncPort = vncPort;
    }

    public int getVncWebPort() {
        return vncWebPort;
    }

    public void setVncWebPort(int vncWebPort) {
        this.vncWebPort = vncWebPort;
    }

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }
}
