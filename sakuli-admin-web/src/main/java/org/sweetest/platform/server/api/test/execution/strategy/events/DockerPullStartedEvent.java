package org.sweetest.platform.server.api.test.execution.strategy.events;

import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

public class DockerPullStartedEvent extends TestExecutionEvent {


    public DockerPullStartedEvent(String pid) {
        super("docker.pull.started", "", pid);
    }
}
