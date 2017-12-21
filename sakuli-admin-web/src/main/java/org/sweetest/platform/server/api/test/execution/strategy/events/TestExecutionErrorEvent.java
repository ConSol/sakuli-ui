package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class TestExecutionErrorEvent extends TestExecutionEvent {
    private Exception exception;

    public TestExecutionErrorEvent(String message, String pid, Exception e) {
        super(TestExecutionErrorEvent.TYPE_ERROR, message, pid);
        exception = e;
    }

    public String getStacktrace() {
        return Stream.of(exception.getStackTrace()).map(se -> se.toString()).collect(Collectors.joining("˙n"));
    }


}
