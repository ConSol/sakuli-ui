package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class TestExecutionLogEvent extends TestExecutionEvent {

    public static final String Type = "test.log";

    public TestExecutionLogEvent(String pid, String message) {
        super(Type, message, pid);
    }
}
