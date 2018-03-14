package org.sweetest.platform.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.sweetest.platform.server.web.socketproxy.ProxyWebSocketServerHandler;

import java.util.Map;


@Configuration
@EnableWebSocket
public class WebSocketProxyConfig implements WebSocketConfigurer {

    final public static String URL = "/ws/novnc/{port}";

    final private Logger logger = LoggerFactory.getLogger(WebSocketProxyConfig.class);


    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(new ProxyWebSocketServerHandler(), URL)
                .setAllowedOrigins("*")
        .addInterceptors(new HandshakeInterceptor() {
            @Override
            public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                logger.info("interfacpted before hs");
                return true;
            }

            @Override
            public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
                logger.info("interfacpted after hs");
                String requiredHeader = "sec-websocket-protocol";
                if(request.getHeaders().get(requiredHeader).size() > 0) {
                    response.getHeaders().add(requiredHeader, request.getHeaders().get(requiredHeader).get(0));
                }
            }
        });
    }


}
