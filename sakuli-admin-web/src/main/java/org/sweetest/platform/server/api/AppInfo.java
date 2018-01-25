package org.sweetest.platform.server.api;

import com.github.dockerjava.core.DockerClientConfig;

public class AppInfo {

    private DockerClientConfig dockerClientConfig;
    private boolean authenticationEnabled;
    private boolean dockerComposeExecutionEnabled;
    private boolean dockerContainerExecutionEnabled;
    private boolean localExecutionEnabled;
    private boolean dockerFileExecutionEnabled;
    private String version;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public DockerClientConfig getDockerClientConfig() {
        return dockerClientConfig;
    }

    public void setDockerClientConfig(DockerClientConfig dockerClientConfig) {
        this.dockerClientConfig = dockerClientConfig;
    }

    public boolean isAuthenticationEnabled() {
        return authenticationEnabled;
    }

    public void setAuthenticationEnabled(boolean authenticationEnabled) {
        this.authenticationEnabled = authenticationEnabled;
    }

    public boolean isDockerComposeExecutionEnabled() {
        return dockerComposeExecutionEnabled;
    }

    public void setDockerComposeExecutionEnabled(boolean dockerComposeExecutionEnabled) {
        this.dockerComposeExecutionEnabled = dockerComposeExecutionEnabled;
    }

    public boolean isDockerContainerExecutionEnabled() {
        return dockerContainerExecutionEnabled;
    }

    public void setDockerContainerExecutionEnabled(boolean dockerContainerExecutionEnabled) {
        this.dockerContainerExecutionEnabled = dockerContainerExecutionEnabled;
    }

    public boolean isLocalExecutionEnabled() {
        return localExecutionEnabled;
    }

    public void setLocalExecutionEnabled(boolean localExecutionEnabled) {
        this.localExecutionEnabled = localExecutionEnabled;
    }

    public boolean isDockerFileExecutionEnabled() {
        return dockerFileExecutionEnabled;
    }

    public void setDockerFileExecutionEnabled(boolean dockerFileExecutionEnabled) {
        this.dockerFileExecutionEnabled = dockerFileExecutionEnabled;
    }
}
