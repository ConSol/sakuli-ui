package org.sweetest.platform.server;


import io.fabric8.docker.client.Config;
import io.fabric8.docker.client.ConfigBuilder;
import io.fabric8.docker.client.DefaultDockerClient;
import io.fabric8.docker.client.DockerClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DockerConfig {

    @Bean
    public Config getDockerConfig() {
        return new ConfigBuilder()
                .build();
    }

    @Bean
    public DockerClient getDockerClient(@Autowired Config dockerConfig) {
        return new DefaultDockerClient(dockerConfig);
    }



}
