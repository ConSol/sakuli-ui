package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class TestExecutionCompletedEvent extends TestExecutionEvent {

    public static final String Type = "test.lifecycle.completed";

    public TestExecutionCompletedEvent(String pid) {
        super(Type, "", pid);
    }
}
