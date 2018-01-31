package org.sweetest.platform.server.api.test;

public class TestRunInfoPorts {

    private int vnc;
    private int web;

    public TestRunInfoPorts() {}

    public TestRunInfoPorts(int vnc, int web) {
        this.vnc = vnc;
        this.web = web;
    }

    public int getVnc() {
        return vnc;
    }

    public void setVnc(int vnc) {
        this.vnc = vnc;
    }

    public int getWeb() {
        return web;
    }

    public void setWeb(int web) {
        this.web = web;
    }
}
