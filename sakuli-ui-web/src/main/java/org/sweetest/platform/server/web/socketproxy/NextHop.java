package org.sweetest.platform.server.web.socketproxy;

import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import javax.websocket.ContainerProvider;
import javax.websocket.WebSocketContainer;
import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;

/**
 * Represents a 'hop' in the proxying chain, establishes a 'client' to
 * communicate with the next server, with a {@link ProxyWebSocketClientHandler}
 * to copy data from the 'client' to the supplied 'server' session.
 */
public class NextHop {

    private final WebSocketSession webSocketClientSession;
    private String port;

    public NextHop(WebSocketSession webSocketServerSession, String port) {
        this.port = port;
        webSocketClientSession = createWebSocketClientSession(webSocketServerSession);
    }

    private WebSocketSession createWebSocketClientSession(WebSocketSession webSocketServerSession) {
        try {
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();

            container.setDefaultMaxBinaryMessageBufferSize(500 * 1024);
            container.setDefaultMaxTextMessageBufferSize(500 * 1024);
            WebSocketHttpHeaders webSocketHttpHeaders = new WebSocketHttpHeaders();
            webSocketHttpHeaders.add("sec-websocket-protocol", "binary");

            return new StandardWebSocketClient(container)
                    .doHandshake(new ProxyWebSocketClientHandler(webSocketServerSession),
                            webSocketHttpHeaders,
                            URI.create(String.format("ws://localhost:%s/websockify",port)))
                    .get(1000 * 60, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void sendMessageToNextHop(WebSocketMessage<?> webSocketMessage) throws IOException {
        webSocketClientSession.sendMessage(webSocketMessage);
    }
}
