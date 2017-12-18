package org.sweetest.platform.server;

import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Configuration
public class ApplicationConfig {

    private static final String SAKULI_ADMIN_PREFIX = "sakuli.admin.";
    private static final String SAKULI_ADMIN_ENV_PREFIX = "SAKULI_ADMIN_";

    public static final String ROOT_DIRECTORY = SAKULI_ADMIN_PREFIX + "root.directory";
    public static final String ROOT_DIRECTORY_ENV = SAKULI_ADMIN_ENV_PREFIX + "ROOT_DIRECTORY";

    public static final String PROJECT_DEFAULT = SAKULI_ADMIN_PREFIX + "testSuite.default";
    public static final String PROJECT_DEFAULT_ENV = SAKULI_ADMIN_ENV_PREFIX + "PROJECT_DEFAULT";

    @Bean(name = "rootDirectory")
    public static String getRootDirectory() {
        String defaultRootDirectory = Optional
                .ofNullable(System.getenv(ROOT_DIRECTORY_ENV))
                .orElse(System.getProperty("user.home"));
        return System.getProperty(ROOT_DIRECTORY, defaultRootDirectory);
    }

    @Bean(name = "defaultProject")
    @Deprecated
    public static String getDefaultProject() {
        if(System.getProperty(PROJECT_DEFAULT) != null) {
            return System.getProperty(PROJECT_DEFAULT);
        }
        if(System.getenv(PROJECT_DEFAULT_ENV) != null) {
            return System.getenv(PROJECT_DEFAULT_ENV);
        }
        return null;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public EmbeddedServletContainerCustomizer handle404Error() {
        return new EmbeddedServletContainerCustomizer() {
            @Override
            public void customize(ConfigurableEmbeddedServletContainer configurableEmbeddedServletContainer) {
                configurableEmbeddedServletContainer.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/"));
            }
        };
    }
}
