package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

import static java.util.Collections.EMPTY_LIST;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DockerComposeServiceModel {
    public String context;
    public List<DockerComposeServicePortMappingModel> ports = EMPTY_LIST;

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public List<DockerComposeServicePortMappingModel> getPorts() {
        return ports;
    }

    public void setPorts(List<DockerComposeServicePortMappingModel> ports) {
        this.ports = ports;
    }
}
