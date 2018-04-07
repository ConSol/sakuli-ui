package org.sweetest.platform.server.service.test.execution;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.util.UriTemplate;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class TestExecutionMessageBroker implements ApplicationListener<SessionSubscribeEvent> {

    final private Logger logger = LoggerFactory.getLogger(TestExecutionMessageBroker.class);

    private final String pidVariable = "pid";
    private final UriTemplate uriTemplate = new UriTemplate("/topic/test-run-info/{" + pidVariable + "}");

    private final SimpMessagingTemplate simpMessagingTemplate;

    private final Map<String, Queue<TestExecutionEvent>> eventQueue = new ConcurrentHashMap<>();
    private final List<CompoundStringKey> subscriptions = new CopyOnWriteArrayList<>();
    private final static Queue<TestExecutionEvent> EMPTY_QUEUE = new ConcurrentLinkedQueue<>();


    @Autowired
    public TestExecutionMessageBroker(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void onApplicationEvent(SessionSubscribeEvent sessionSubscribeEvent) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionSubscribeEvent.getMessage());
        final String sessionId = headerAccessor.getSessionId();
        logger.info("Session: {}, \nUser: {} ",
                sessionId,
                headerAccessor.getUser()
        );
        final Map<String, String> match = uriTemplate.match(headerAccessor.getDestination());
        if (match.containsKey(pidVariable)) {
            String executionId = match.get(pidVariable);
            CompoundStringKey key = new CompoundStringKey(executionId, sessionId);
            if(!subscriptions.contains(key)) {
                logger.info("Publish {} events to session {} on execution {}",
                        eventQueue.getOrDefault(executionId, EMPTY_QUEUE).size(),
                        sessionId,
                        executionId
                        );
                sendAll(executionId, sessionId);
                subscriptions.add(key);
            }
        }
    }

    private void sendAll(String testExecutionId, String sessionId) {
        if (eventQueue.containsKey(testExecutionId)) {
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
                    .create(SimpMessageType.MESSAGE);
            headerAccessor.setSessionId(sessionId);
            headerAccessor.setLeaveMutable(true);
            eventQueue
                    .get(testExecutionId)
                    .forEach(e -> simpMessagingTemplate.convertAndSend(
                            getUrlString(testExecutionId),
                            e,
                            headerAccessor.getMessageHeaders()
                    ));

        }
    }

    public void send(String testExecutionId, TestExecutionEvent event) {
        simpMessagingTemplate.convertAndSend(
                getUrlString(testExecutionId),
                event
        );
        addEventToQueue(testExecutionId, event);
    }

    private void addEventToQueue(String testExecutionId, TestExecutionEvent event) {
        if (!eventQueue.containsKey(testExecutionId)) {
            eventQueue.put(testExecutionId, new ConcurrentLinkedQueue<>());
        }
        eventQueue.get(testExecutionId).add(event);
    }

    private String getUrlString(String testExecutionId) {
        final HashMap<String, String> uriVariables = new HashMap<String, String>() {{
            put(pidVariable, testExecutionId);
        }};
        return uriTemplate.expand(uriVariables).toString();
    }

    private class CompoundStringKey {
        private String keyA;
        private String keyB;

        public CompoundStringKey(String keyA, String keyB) {
            this.keyA = keyA;
            this.keyB = keyB;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            CompoundStringKey that = (CompoundStringKey) o;
            return Objects.equals(keyA, that.keyA) &&
                    Objects.equals(keyB, that.keyB);
        }

        @Override
        public int hashCode() {

            return Objects.hash(keyA, keyB);
        }
    }
}
