package org.sweetest.platform.server.api.runconfig;

import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubRepository;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubTag;

import java.util.ArrayList;
import java.util.List;

public class SakuliExecutionConfiguration {
    private DockerHubRepository container;
    private DockerHubTag tag;
    private List<KeyValuePair> environment = new ArrayList<>();

    public DockerHubRepository getContainer() {
        return container;
    }

    public void setContainer(DockerHubRepository container) {
        this.container = container;
    }

    public DockerHubTag getTag() {
        return tag;
    }

    public void setTag(DockerHubTag tag) {
        this.tag = tag;
    }

    public List<KeyValuePair> getEnvironment() {
        return environment;
    }

    public void setEnvironment(List<KeyValuePair> environment) {
        this.environment = environment;
    }
}
