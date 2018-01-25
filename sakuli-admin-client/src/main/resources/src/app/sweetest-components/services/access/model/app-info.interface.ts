export interface DockerClientConfig {
  registryUserName: string;
  dockerHost: string;
  apiVersion: string;
  registryEmail: string;
  registryUrl: string;
  authConfigurations: any;
  sSlConfig: any;
}

export interface AppInfo {
  dockerClientConfig: DockerClientConfig
  authenticationEnabled: boolean;
  dockerComposeExecutionEnabled: boolean;
  dockerContainerExecutionEnabled: boolean;
  localExecutionEnabled: boolean;
  dockerFileExecutionEnabled: boolean;
}
