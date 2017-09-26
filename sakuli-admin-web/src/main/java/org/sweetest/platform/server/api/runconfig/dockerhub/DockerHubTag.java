package org.sweetest.platform.server.api.runconfig.dockerhub;

import java.util.Date;

public class DockerHubTag {
    private String name;
    private Date last_updated;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getLast_updated() {
        return last_updated;
    }

    public void setLast_updated(Date last_updated) {
        this.last_updated = last_updated;
    }
}
