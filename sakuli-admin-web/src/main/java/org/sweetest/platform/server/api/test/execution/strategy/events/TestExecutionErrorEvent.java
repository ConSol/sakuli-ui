package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class TestExecutionErrorEvent extends TestExecutionEvent {
    public TestExecutionErrorEvent(String message, String pid) {
        super(TestExecutionErrorEvent.TYPE_ERROR, message, pid);
    }
}
