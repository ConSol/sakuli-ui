package org.sweetest.platform.server.web.socketproxy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.ClientEndpoint;
import javax.websocket.OnMessage;
import javax.websocket.Session;

@ClientEndpoint()
public class SockerProxyEndpoint {

    private static final Logger logger = LoggerFactory.getLogger(SockerProxyEndpoint.class);

    @OnMessage
    public void handleMessage(Session session, String message) {
        logger.info("Got message: " + message);
    }

}
