package org.sweetest.platform.server.service.test.execution.config;

import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.runconfig.ExecutionTypes;
import org.sweetest.platform.server.api.runconfig.KeyValuePair;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubRepository;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubTag;

import java.util.List;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RunConfigurationPropertyMapperService {
    static final private String PROPERTY_PREFIX = "sakuli.ui";

    private static String propertyName(String suffix) {
        return String.format("%s.%s", PROPERTY_PREFIX, suffix);
    }

    static final public String PROPERTY_TYPE = propertyName("type");
    static final public String PROPERTY_DOCKERFILE_FILE = propertyName("dockerfile.file");
    static final public String PROPERTY_DOCKER_COMPOSE_FILE = propertyName("docker-compose.file");
    static final public String PROPERTY_SAKULI_CONTAINER_CONTAINER = propertyName("sakuli-container.container");
    static final public String PROPERTY_SAKULI_CONTAINER_TAG = propertyName("sakuli-container.tag");
    static final public String PROPERTY_SAKULI_CONTAINER_ENV = propertyName("sakuli-container.env");


    public void propertiesToRunConfiguration(Properties properties, RunConfiguration runConfiguration) {
        ExecutionTypes type = ExecutionTypes.valueOf(properties.getProperty(PROPERTY_TYPE, runConfiguration.getType().name()));
        runConfiguration.setType(type);
        runConfiguration.getDockerfile().setFile(
                properties.getProperty(PROPERTY_DOCKERFILE_FILE, runConfiguration.getDockerfile().getFile()));

        runConfiguration.getDockerCompose().setFile(
                properties.getProperty(PROPERTY_DOCKER_COMPOSE_FILE, runConfiguration.getDockerCompose().getFile()));

        String pTagName = properties.getProperty(PROPERTY_SAKULI_CONTAINER_TAG);
        if(pTagName != null) {
            DockerHubTag tag = (runConfiguration.getSakuli().getTag() == null) ? new DockerHubTag() : runConfiguration.getSakuli().getTag();
            tag.setName(pTagName);
            runConfiguration.getSakuli().setTag(tag);
        }

        String pContainerName = properties.getProperty(PROPERTY_SAKULI_CONTAINER_CONTAINER);
        if(pContainerName != null) {
            DockerHubRepository container = (runConfiguration.getSakuli().getContainer() == null) ? new DockerHubRepository() : runConfiguration.getSakuli().getContainer();
            container.setNamespacedName(pContainerName);
            runConfiguration.getSakuli().setContainer(container);
        }
        AtomicInteger i = new AtomicInteger(0);

        List<KeyValuePair> env = runConfiguration.getSakuli().getEnvironment();
        boolean resume = true;
        do {
            String pNameBase = String.format("%s.%s",
                    PROPERTY_SAKULI_CONTAINER_ENV,
                    i.getAndIncrement());
            String pKey = properties.getProperty(pNameBase + ".key");
            String pValue = properties.getProperty(pNameBase + ".value");
            if (pKey != null) {
                env.add(new KeyValuePair(pKey, pValue));
            }
            resume = pKey != null;
        } while (resume);
    }

    public void runConfigToProperties(RunConfiguration runConfiguration, Properties properties) {
        properties.setProperty(PROPERTY_TYPE, runConfiguration.getType().name());
        properties.setProperty(PROPERTY_DOCKERFILE_FILE, runConfiguration.getDockerfile().getFile());
        properties.setProperty(PROPERTY_DOCKER_COMPOSE_FILE, runConfiguration.getDockerCompose().getFile());
        if(runConfiguration.getSakuli().getContainer() != null) {
            properties.setProperty(PROPERTY_SAKULI_CONTAINER_CONTAINER, runConfiguration.getSakuli().getContainer().getNamespacedName());
        }
        if(runConfiguration.getSakuli().getTag() != null) {
            properties.setProperty(PROPERTY_SAKULI_CONTAINER_TAG, runConfiguration.getSakuli().getTag().getName());
        }
        AtomicInteger i = new AtomicInteger(0);
        runConfiguration.getSakuli().getEnvironment().forEach((p) -> {
            String pNameBase = String.format("%s.%s",
                    PROPERTY_SAKULI_CONTAINER_ENV,
                    i.getAndIncrement());
            properties.setProperty(pNameBase + ".key", p.getKey());
            properties.setProperty(pNameBase + ".value", p.getValue());
        });
    }
}
