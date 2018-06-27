package org.sweetest.platform.server.web.socketproxy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.util.UriTemplate;
import org.sweetest.platform.server.WebSocketProxyConfig;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ProxyWebSocketServerHandler extends BinaryWebSocketHandler {

    private final static Logger logger = LoggerFactory.getLogger(ProxyWebSocketServerHandler.class);

    private UriTemplate uriTemplate = new UriTemplate(WebSocketProxyConfig.URL);

    private Map<String, WebSocketClient> webSocketClientMap = new HashMap<>();

    private String port;
    private String gateway;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Map<String, String> match = uriTemplate.match(session.getUri().getPath());
        port = match.get("port");
        gateway = match.get("gateway");
        getNextHop(session, port);
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        removeHop(session);
        super.afterConnectionClosed(session, status);
    }

    private final Map<String, NextHop> nextHops = new ConcurrentHashMap<>();

    @Override
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {
        getNextHop(webSocketSession).sendMessageToNextHop(webSocketMessage);
    }

    private NextHop createHop(WebSocketSession webSocketSession, String port) {
        NextHop nextHop = new NextHop(webSocketSession, URI.create(String.format("ws://%s:%s/websockify", gateway, port)));
        nextHops.put(webSocketSession.getId(), nextHop);
        return nextHop;
    }

    private NextHop getNextHop(WebSocketSession webSocketSession) {
        return getNextHop(webSocketSession, port);
    }

    private NextHop getNextHop(WebSocketSession webSocketSession, String port) {
        NextHop nextHop = nextHops.get(webSocketSession.getId());
        if (nextHop == null) {
            nextHop = createHop(webSocketSession, port);
            nextHops.put(webSocketSession.getId(), nextHop);
        }
        return nextHop;
    }

    private void removeHop(WebSocketSession webSocketSession) {
        nextHops.remove(webSocketSession.getId());
    }
}