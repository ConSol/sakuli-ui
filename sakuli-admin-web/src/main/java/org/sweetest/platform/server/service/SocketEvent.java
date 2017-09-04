package org.sweetest.platform.server.service;

public class SocketEvent {
    String processId;
    String message;

    public SocketEvent(String processId, String message) {
        this.processId = processId;
        this.message = message;
    }

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
