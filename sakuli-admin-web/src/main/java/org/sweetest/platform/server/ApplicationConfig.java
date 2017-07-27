package org.sweetest.platform.server;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    private static final String SAKULI_ADMIN_PREFIX = "sakuli.admin.";
    private static final String SAKULI_ADMIN_ENV_PREFIX = "SAKULI_ADMIN_";

    public static final String ROOT_DIRECTORY = SAKULI_ADMIN_PREFIX + "root.directory";
    public static final String ROOT_DIRECTORY_ENV = SAKULI_ADMIN_ENV_PREFIX + "ROOT_DIRECTORY";

    @Bean(name = "rootDirectory")
    public static String getRootDirectory() {
        return System.getProperty(ROOT_DIRECTORY, System.getenv(ROOT_DIRECTORY_ENV) != null ? System.getenv(ROOT_DIRECTORY_ENV) : System.getProperty("user.home"));
    }
}
