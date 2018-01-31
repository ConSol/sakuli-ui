package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class TestExecutionStopEvent extends TestExecutionEvent {

    public static final String Type = "test.lifecycle.stop";

    public TestExecutionStopEvent(String pid) {
        super(Type, "", pid);
    }
}
