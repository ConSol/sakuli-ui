package org.sweetest.platform.server.service.test.execution.strategy;

import org.sweetest.platform.server.api.common.process.LocalCommand;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionErrorEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionLogEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStartEvent;

public class CommandExecutorRunnable implements Runnable {
    private TestExecutionSubject subject;
    private LocalCommand command;
    private String executionId;

    public CommandExecutorRunnable(String executionId, LocalCommand command, TestExecutionSubject subject) {
        this.subject = subject;
        this.command = command;
        this.executionId = executionId;
    }

    @Override
    public void run() {
        try {
            // wait before emit the start of execution because
            // otherwise some messages are published before client subscribes
            // some queuing technique might be more elegant and resilient at this point
            Thread.sleep(500);
            subject.next(new TestExecutionStartEvent(executionId));
            command.execute(
                    s -> subject.next(new TestExecutionLogEvent(executionId, s)),
                    s -> subject.next(new TestExecutionLogEvent(executionId, s))
            ).waitFor();
            subject.next(new TestExecutionCompletedEvent(executionId));
        } catch (Exception e) {
            subject.next(new TestExecutionErrorEvent(e.getMessage(), executionId));
            e.printStackTrace();
        }
    }
}
