package org.sweetest.platform.server.service.test.execution.config;

import org.junit.Before;
import org.junit.Test;
import org.sweetest.platform.server.api.runconfig.ExecutionTypes;
import org.sweetest.platform.server.api.runconfig.KeyValuePair;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubRepository;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubTag;

import java.io.IOException;
import java.util.Properties;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class RunConfigurationPropertyMapperServiceTest {

    private RunConfigurationPropertyMapperService sut;

    @Before
    public void initTest() {
        sut = new RunConfigurationPropertyMapperService();
    }

    @Test
    public void propertiesToRunConfiguration() throws IOException {
        Properties emptyProperties = new Properties();
        emptyProperties.load(getClass().getResourceAsStream("rc-properties/test_1.properties"));
        RunConfiguration runConfiguration = new RunConfiguration();
        sut.propertiesToRunConfiguration(emptyProperties,runConfiguration);
        assertEquals(runConfiguration.getType(), ExecutionTypes.SakuliContainer);
        assertEquals(runConfiguration.getDockerCompose().getFile(), "docker-compose-file");
        assertEquals(runConfiguration.getDockerfile().getFile(), "somefile");
        assertEquals(runConfiguration.getSakuli().getContainer().getName(), "sakuli-ubuntu-xfce");
        assertEquals(runConfiguration.getSakuli().getContainer().getNamespace(), "consol");
        assertEquals(runConfiguration.getSakuli().getTag().getName(), "latest");
        assertEquals(runConfiguration.getSakuli().getEnvironment().size(), 3);
        assertEquals(runConfiguration.getSakuli().getEnvironment().get(0).getKey(), "k1");
        assertEquals(runConfiguration.getSakuli().getEnvironment().get(0).getValue(), "v1");
        assertEquals(runConfiguration.getSakuli().getEnvironment().get(2).getKey(), "k3");
        assertEquals(runConfiguration.getSakuli().getEnvironment().get(2).getValue(), "v3");
    }

    @Test
    public void runConfigToProperties() {
        Properties properties = new Properties();
        RunConfiguration rc = new RunConfiguration();
        rc.setType(ExecutionTypes.Local);
        rc.getDockerCompose().setFile("compose-somefile");
        rc.getDockerfile().setFile("somefile");
        rc.getSakuli().setTag(new DockerHubTag() {{
            setName("latest");
        }});
        rc.getSakuli().setContainer(new DockerHubRepository() {{
            setNamespacedName("consol/sakuli");
        }});
        rc.getSakuli().setEnvironment(asList(
                new KeyValuePair("k0", "v0"),
                new KeyValuePair("k1", "v1")
        ));

        sut.runConfigToProperties(rc, properties);

        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_TYPE), "Local");
        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_DOCKER_COMPOSE_FILE), "compose-somefile");
        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_DOCKERFILE_FILE), "somefile");
        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_SAKULI_CONTAINER_CONTAINER), "consol/sakuli");
        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_SAKULI_CONTAINER_TAG), "latest");
        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_SAKULI_CONTAINER_ENV + ".1.key"), "k1");
        assertEquals(properties.getProperty(RunConfigurationPropertyMapperService.PROPERTY_SAKULI_CONTAINER_ENV + ".1.value"), "v1");
    }

    @Test
    public void runConfigNoSakuli() throws IOException {
        Properties emptyProperties = new Properties();
        emptyProperties.load(getClass().getResourceAsStream("rc-properties/test_2.properties"));
        RunConfiguration runConfiguration = new RunConfiguration();
        sut.propertiesToRunConfiguration(emptyProperties,runConfiguration);
        assertNull(runConfiguration.getSakuli().getContainer());
        assertNull(runConfiguration.getSakuli().getTag());
    }
}