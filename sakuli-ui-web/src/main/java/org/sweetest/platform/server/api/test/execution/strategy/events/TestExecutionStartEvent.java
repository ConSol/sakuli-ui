package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class TestExecutionStartEvent extends TestExecutionEvent {

    public static final String Type = "test.lifecycle.started";

    public TestExecutionStartEvent(String pid) {
        super(Type, "", pid);
    }
}
