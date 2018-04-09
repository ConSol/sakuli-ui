package org.sweetest.platform.server.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.jaxrs.JerseyDockerCmdExecFactory;
import com.github.dockerjava.netty.NettyDockerCmdExecFactory;
import org.apache.commons.lang.SystemUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

import static org.sweetest.platform.server.ApplicationConfig.DOCKER_CONTAINER_SAKULI_UI_USER;
import static org.sweetest.platform.server.ApplicationConfig.HOSTNAME;

@Configuration
public class DockerConfig {

    @Bean
    public DockerClient dockerClient() {
        if (SystemUtils.IS_OS_LINUX) {
            return DockerClientImpl.getInstance(dockerClientConfig())
                    .withDockerCmdExecFactory(new NettyDockerCmdExecFactory());
        } else {
            return DockerClientImpl.getInstance(dockerClientConfig())
                    .withDockerCmdExecFactory(new JerseyDockerCmdExecFactory());
        }
    }

    @Bean
    public DockerClientConfig dockerClientConfig() {
        final DefaultDockerClientConfig.Builder configBuilder = DefaultDockerClientConfig
                .createDefaultConfigBuilder();

        if (System.getenv().containsKey(DOCKER_CONTAINER_SAKULI_UI_USER) && System.getenv().containsKey(HOSTNAME)) {
            configBuilder.withDockerHost(System.getenv().get(HOSTNAME));
        }

        return configBuilder.build();
    }

    @Bean(name = "resolvedDockerHost")
    public String getResolvedDockerHost(@Autowired DockerClientConfig dockerClientConfig) {
        final URI dockerHost = dockerClientConfig.getDockerHost();
        switch (dockerHost.getScheme()) {
            case "http":
            case "https":
            case "tcp":
                return dockerHost.getHost();
            case "unix":
                return "localhost";
            default:
                return "localhost";
        }
    }


    @Bean(name = "resolvedDockerSchema")
    public String getScheme(@Autowired DockerClientConfig dockerClientConfig) {
        final URI dockerHost = dockerClientConfig.getDockerHost();
        switch (dockerHost.getScheme()) {
            case "http":
            case "https":
                return dockerHost.getScheme();
            case "tcp":
            case "unix":
                return "http";
            default:
                return "http";
        }
    }

}
