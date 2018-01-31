package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class DockerPullProgressEvent extends TestExecutionEvent {


    public DockerPullProgressEvent(String executionId, String message) {
        super("docker.pull.progress", message, executionId);
    }
}
