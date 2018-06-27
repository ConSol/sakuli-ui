package org.sweetest.platform.server.web.socketproxy;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

/**
 * Copies data from the client to the server session.
 */
public class ProxyWebSocketClientHandler extends AbstractWebSocketHandler {
    private final static Logger logger = LoggerFactory.getLogger(ProxyWebSocketClientHandler.class);

    private final WebSocketSession webSocketServerSession;

    public ProxyWebSocketClientHandler(WebSocketSession webSocketServerSession) {
        this.webSocketServerSession = webSocketServerSession;
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> webSocketMessage) throws Exception {
        if(webSocketServerSession.isOpen()) {
            webSocketServerSession.sendMessage(webSocketMessage);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
    }
}