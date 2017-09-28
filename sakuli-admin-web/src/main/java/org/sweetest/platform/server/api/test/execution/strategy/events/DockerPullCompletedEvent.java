package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class DockerPullCompletedEvent extends TestExecutionEvent {


    public DockerPullCompletedEvent(String executionId) {
        super("docker.pull.completed", "", executionId);
    }
}
