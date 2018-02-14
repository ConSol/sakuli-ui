package org.sweetest.platform.server.service.test.execution.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class SakuliLocalExecutionConfig {

    public static final String SAKULI_HOME_FOLDER = "sakuli.home.folder";
    public static final String SAKULI_HOME_FOLDER_ENV = "SAKULI_HOME";

    @Bean(name = "sakuliHome")
    public static String getSakuliHome() {
        return Optional
                .ofNullable(System.getProperty(SAKULI_HOME_FOLDER))
                .orElse(System.getenv(SAKULI_HOME_FOLDER_ENV));
    }
}
