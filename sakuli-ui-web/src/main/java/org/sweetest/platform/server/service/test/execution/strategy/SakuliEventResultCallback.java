package org.sweetest.platform.server.service.test.execution.strategy;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.Event;
import com.github.dockerjava.core.command.EventsResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionSubject;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStartEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionStopEvent;

public class SakuliEventResultCallback extends EventsResultCallback{

    private static final Logger log = LoggerFactory.getLogger(SakuliEventResultCallback.class);

    private final static String ACTION_START = "start";
    private final static String ACTION_DISCONNECT = "disconnect";
    private final static String ACTION_KILL = "kill";

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
        String action = item.getAction();
        if(ACTION_START.equals(action)) {
            subject.next(new TestExecutionStartEvent(executionId));
        }
        if (ACTION_DISCONNECT.equals(action)) {
            subject.next(new TestExecutionCompletedEvent(executionId));
        }
        if (ACTION_KILL.equals(action)) {
            subject.next(new TestExecutionStopEvent(executionId));
        }
        if (ACTION_DISCONNECT.equals(action) || ACTION_KILL.equals(action)) {
            log.info(ReflectionToStringBuilder.toString(item.getActor(), ToStringStyle.MULTI_LINE_STYLE));
            if(item.getActor().getAttributes() != null && item.getActor().getAttributes().containsKey("container")) {
                String containerId = item.getActor().getAttributes().getOrDefault("container", item.getActor().getId());
                log.info("Clean up and remove container " + containerId);
                dockerClient.removeContainerCmd(containerId).exec();
            }
            super.onComplete();
        } else {
            super.onNext(item);
        }
    }
}
