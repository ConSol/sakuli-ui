package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DockerComposeServicePortMappingModel {
    private int target;
    private int published;
    private String protocol = "tcp";
    private String mode = "host";

    public DockerComposeServicePortMappingModel() {
    }

    /**
     * Well even the jackson mapper accepts this string based constructor
     * and calls it if the .yml entry is a String
     * @param mapping
     */
    public DockerComposeServicePortMappingModel(String mapping) {
        if(mapping.contains("/")) {
            String[] parts = mapping.split("/");
            assignTargetAndPublished(parts[0]);
            setProtocol(parts[1]);
        } else {
            assignTargetAndPublished(mapping);
        }

    }

    private void assignTargetAndPublished(String part) {
        if(part.contains(":")) {
            String[] parts = part.split(":");
            setPublished(Integer.parseInt(parts[0]));
            setTarget(Integer.parseInt(parts[1]));
        }
    }

    public int getTarget() {
        return target;
    }

    public void setTarget(int target) {
        this.target = target;
    }


    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public int getPublished() {
        return published;
    }

    public void setPublished(int published) {
        this.published = published;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }
}
