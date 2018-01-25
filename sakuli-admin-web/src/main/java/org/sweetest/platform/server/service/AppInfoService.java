package org.sweetest.platform.server.service;

import com.github.dockerjava.core.DockerClientConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.AppInfo;

@Service
public class AppInfoService {

    @Autowired
    private DockerClientConfig dockerClientConfig;

    @Value("${app.authentication.enabled}")
    private boolean authenticationEnabled;

    @Value("${app.execution.dockercompose.enabled}")
    private boolean dockerComposeExecutionEnabled;

    @Value("${app.execution.dockercontainer.enabled}")
    private boolean dockerContainerExecutionEnabled;

    @Value("${app.execution.local.enabled}")
    private boolean localExecutionEnabled;

    @Value("${app.execution.dockerfile.enabled}")
    private boolean dockerFileExecutionEnabled;

    @Value("${app.version}")
    private String version;

    public AppInfo getAppInfo() {
        AppInfo appInfo = new AppInfo();
        appInfo.setAuthenticationEnabled(authenticationEnabled);
        appInfo.setDockerClientConfig(dockerClientConfig);
        appInfo.setDockerContainerExecutionEnabled(dockerContainerExecutionEnabled);
        appInfo.setDockerComposeExecutionEnabled(dockerComposeExecutionEnabled);
        appInfo.setLocalExecutionEnabled(localExecutionEnabled);
        appInfo.setDockerFileExecutionEnabled(dockerFileExecutionEnabled);
        appInfo.setVersion(version);
        return appInfo;
    }

}
