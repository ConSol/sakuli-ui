package org.sweetest.platform.server.api.test.execution.strategy;

import java.util.Date;

public class TestExecutionEvent {

    public final static String TYPE_LOG = "log";
    public final static String TYPE_FINISH = "finish";
    public final static String TYPE_STARTED = "started";
    public static final String TYPE_WARNING = "warning";

    String type;
    String message;
    String processId;
    Date timestamp;

    public TestExecutionEvent(String type, String message, String pid) {
        timestamp = new Date();
        this.type = type;
        this.message = message;
        this.processId = pid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
