package org.sweetest.platform.server.api.runconfig;

public class RunConfiguration {
    private ExecutionTypes type = ExecutionTypes.SakuliContainer;
    private DockerFileExecutionConfiguration dockerfile = new DockerFileExecutionConfiguration();
    private DockerComposeExecutionConfiguration dockerCompose = new DockerComposeExecutionConfiguration();
    private LocalExecutionConfiguration local = new LocalExecutionConfiguration();
    private SakuliExecutionConfiguration sakuli = new SakuliExecutionConfiguration();

    public ExecutionTypes getType() {
        return type;
    }

    public void setType(ExecutionTypes type) {
        this.type = type;
    }

    public DockerFileExecutionConfiguration getDockerfile() {
        return dockerfile;
    }

    public void setDockerfile(DockerFileExecutionConfiguration dockerfile) {
        this.dockerfile = dockerfile;
    }

    public DockerComposeExecutionConfiguration getDockerCompose() {
        return dockerCompose;
    }

    public void setDockerCompose(DockerComposeExecutionConfiguration dockerCompose) {
        this.dockerCompose = dockerCompose;
    }

    public LocalExecutionConfiguration getLocal() {
        return local;
    }

    public void setLocal(LocalExecutionConfiguration local) {
        this.local = local;
    }

    public SakuliExecutionConfiguration getSakuli() {
        return sakuli;
    }

    public void setSakuli(SakuliExecutionConfiguration sakuli) {
        this.sakuli = sakuli;
    }
}
