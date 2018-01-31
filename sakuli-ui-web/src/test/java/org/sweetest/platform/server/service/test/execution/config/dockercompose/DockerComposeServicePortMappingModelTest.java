package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DockerComposeServicePortMappingModelTest {

    @Test
    public void testStringBasedConstructorWithBasicNotation() {
        DockerComposeServicePortMappingModel model = new DockerComposeServicePortMappingModel("9091:9090");

        assertEquals(9091, model.getPublished());
        assertEquals(9090, model.getTarget());
    }

    @Test
    public void testStringBasedConstructorWithProtocol() {
        DockerComposeServicePortMappingModel model = new DockerComposeServicePortMappingModel("9091:9090/udp");

        assertEquals(9091, model.getPublished());
        assertEquals(9090, model.getTarget());
        assertEquals("udp", model.getProtocol());
    }

}