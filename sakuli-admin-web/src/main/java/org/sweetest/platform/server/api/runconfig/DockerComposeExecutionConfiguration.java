package org.sweetest.platform.server.api.runconfig;

public class DockerComposeExecutionConfiguration {
    private String file = "docker-compose.yml";

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }
}
