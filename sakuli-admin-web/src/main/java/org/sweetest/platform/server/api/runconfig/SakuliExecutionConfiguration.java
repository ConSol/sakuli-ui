package org.sweetest.platform.server.api.runconfig;

import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubRepository;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubRepositoryResponse;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubTag;
import org.sweetest.platform.server.api.runconfig.dockerhub.DockerHubTagResponse;

public class SakuliExecutionConfiguration {
    private DockerHubRepository container;
    private DockerHubTag tag;

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
}
