package org.sweetest.platform.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.util.UrlPathHelper;
import org.sweetest.platform.server.web.TestController;

import java.nio.file.Paths;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class ApplicationConfig {

    private static final Logger log = LoggerFactory.getLogger(ApplicationConfig.class);


    public static final String ROOT_DIRECTORY = "sakuli.ui.root.directory";
    public static final String PROJECT_DEFAULT = "sakuli.ui.testSuite.default";
    public static final String ROOT_DIRECTORY_ENV = "SAKULI_UI_ROOT_DIRECTORY";
    public static final String PROJECT_DEFAULT_ENV = "SAKULI_UI_PROJECT_DEFAULT";
    public static final String DOCKER_CONTAINER_SAKULI_UI_USER = "SAKULI_UI_DOCKER_USER_ID";
    public static final String HOSTNAME = "HOSTNAME";


    @Bean(name = "rootDirectory")
    public static String getRootDirectory() {
        String defaultRootDirectory = Optional
                .ofNullable(System.getenv(ROOT_DIRECTORY_ENV))
                .orElse(System.getProperty("user.home"));
        String pathStr = System.getProperty(ROOT_DIRECTORY, defaultRootDirectory);
        String normalizedAbsoluteRoot = Paths.get(pathStr).normalize().toAbsolutePath().toString();
        log.info("Set app root to: {}", normalizedAbsoluteRoot);
        return normalizedAbsoluteRoot;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     *
     * @return ExecutorService
     */
    @Bean
    public ExecutorService testExecutionExecutorService() {
        return Executors.newCachedThreadPool();
    }

    @Bean
    public EmbeddedServletContainerCustomizer handle404Error() {
        return configurableEmbeddedServletContainer -> configurableEmbeddedServletContainer.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/"));
    }

    @Bean
    @Order(-1)
    public UrlPathHelper getUrlPathHelper() {
        return new UrlPathHelperNonDecoding();
    }
}
