package org.sweetest.platform.server.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.jaxrs.JerseyDockerCmdExecFactory;
import com.github.dockerjava.netty.NettyDockerCmdExecFactory;
import org.apache.commons.lang.SystemUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
        return DefaultDockerClientConfig
                .createDefaultConfigBuilder()
                .build();
    }
}
