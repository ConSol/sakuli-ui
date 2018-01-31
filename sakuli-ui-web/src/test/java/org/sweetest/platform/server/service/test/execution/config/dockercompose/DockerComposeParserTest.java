package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import org.junit.Test;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Optional;

import static org.junit.Assert.*;

public class DockerComposeParserTest {

    private DockerComposeModel getModelFromResourceFile(String path)  {
        URL resource = getClass().getResource(path);
        URI uri = null;
        try {
            uri = resource.toURI();
        } catch (URISyntaxException e) {
            fail(e.getMessage());
        }
        Optional<DockerComposeModel> modelOptional = DockerComposeParser.fromFile(new File(uri));
        if(!modelOptional.isPresent()) {
            fail("Could not map docker compose file");
        }
        return modelOptional.get();
    }

    @Test
    public void fromFile() {
        DockerComposeModel model = getModelFromResourceFile("docker-compose-1.yml");

        assertEquals("1", model.getVersion());
        assertEquals(2, model.getServices().size());

        HashMap<String, DockerComposeServiceModel> serviceModelMap = model.getServices();

        assertTrue(serviceModelMap.containsKey("test"));
        assertTrue(serviceModelMap.containsKey("test2"));

        DockerComposeServiceModel test = serviceModelMap
                .get("test");

        assertEquals(1, test.ports.size());

        DockerComposeServiceModel test2 = serviceModelMap
                .get("test2");

        assertEquals(2, test2.ports.size());


    }

    @Test
    public void fromFileComplex() {
        DockerComposeModel model = getModelFromResourceFile("docker-compose-2.yml");

        HashMap<String, DockerComposeServiceModel> serviceModelMap = model.getServices();

        testServiceModelMap(serviceModelMap);


    }

    @Test
    public void fromFileComplex2() {
        DockerComposeModel model = getModelFromResourceFile("docker-compose-3.yml");

        HashMap<String, DockerComposeServiceModel> serviceModelMap = model.getServices();

        testServiceModelMap(serviceModelMap);


    }

    private void testServiceModelMap(HashMap<String, DockerComposeServiceModel> serviceModelMap) {
        assertEquals(2, serviceModelMap.size());
        assertTrue(serviceModelMap.containsKey("sakuli_test_ubuntu_firefox"));
        DockerComposeServiceModel sakuli_test_ubuntu_firefox = serviceModelMap.get("sakuli_test_ubuntu_firefox");
        assertEquals(2, sakuli_test_ubuntu_firefox.getPorts().size());


        assertTrue(serviceModelMap.containsKey("sakuli_test_centos_chrome"));
        DockerComposeServiceModel sakuli_test_centos_chrome = serviceModelMap.get("sakuli_test_centos_chrome");
        assertEquals(2, sakuli_test_centos_chrome.getPorts().size());
    }
}