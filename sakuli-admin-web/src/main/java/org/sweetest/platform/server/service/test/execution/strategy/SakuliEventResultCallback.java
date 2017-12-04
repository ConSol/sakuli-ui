package org.sweetest.platform.server.service.test.execution.strategy;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.Event;
import com.github.dockerjava.core.command.EventsResultCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStartEvent;

public class SakuliEventResultCallback extends EventsResultCallback{

    private static final Logger log = LoggerFactory.getLogger(SakuliEventResultCallback.class);

    private String executionId;
    private TestExecutionSubject subject;
    private DockerClient dockerClient;

    public SakuliEventResultCallback(String executionId, TestExecutionSubject subject, DockerClient dockerClient) {
        this.executionId = executionId;
        this.subject = subject;
        this.dockerClient = dockerClient;
    }

    @Override
    public void onNext(Event item) {
        log.info(item.getAction());
        if(item.getAction().equals("start")) {
            subject.next(new TestExecutionStartEvent(executionId));
        }
        if (item.getAction().equals("disconnect")) {
            subject.next(new TestExecutionCompletedEvent(executionId));
            if(item.getActor().getAttributes() != null && item.getActor().getAttributes().containsKey("container")) {
                String containerId = item.getActor().getAttributes().get("container");
                log.info("Clean up and remove container " + containerId);
                dockerClient.removeContainerCmd(containerId).exec();
            }
            super.onComplete();
        } else {
            super.onNext(item);
        }
    }
}
