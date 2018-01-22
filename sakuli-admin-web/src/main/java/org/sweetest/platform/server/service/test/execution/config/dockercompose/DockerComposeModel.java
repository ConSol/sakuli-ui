package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.HashMap;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DockerComposeModel {
    private String version;
    private HashMap<String, DockerComposeServiceModel> services;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public HashMap<String, DockerComposeServiceModel> getServices() {
        return services;
    }

    public void setServices(HashMap<String, DockerComposeServiceModel> services) {
        this.services = services;
    }
}
