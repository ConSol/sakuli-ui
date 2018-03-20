import {RunConfigurationTypes} from "./run-configuration-types.enum";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {nothrowFn} from "../../../core/utils";
import {KeyValuePairListString} from "../../../sweetest-components/components/forms/key-value-list/key-value-list.interface";

export interface DockerfileExecutionConfiguration {
  file: string;
}

export interface DockerComposeExecutionConfiguration {
  file: string;
}

export interface RunConfiguration {
  type: RunConfigurationTypes;
  local: LocalExecutionConfiguration;
  sakuli: SakuliExecutionConfiguration;
  dockerfile: DockerfileExecutionConfiguration;
  dockerCompose: DockerComposeExecutionConfiguration;
}

export interface LocalExecutionConfiguration {
}

export interface SakuliExecutionConfiguration {
  container: SakuliContainer;
  tag: ContainerTag;
  environment:KeyValuePairListString
}

export const RunConfigurationFeatureName = 'runConfiguration';

export interface SakuliContainer {
  name: string
}

export interface ContainerTag {
  name: string;
}

export interface RunConfigurationState {
  configuration: RunConfiguration,
  containers: SakuliContainer[],
  tags: {[containerId: string]: ContainerTag[]}
}

export class RunConfigurationSelect {

  static feature = createFeatureSelector<RunConfigurationState>(RunConfigurationFeatureName);

  static runConfiguration = createSelector(RunConfigurationSelect.feature, nothrowFn((rc:RunConfigurationState) => rc.configuration));

  static containers = createSelector(RunConfigurationSelect.feature, nothrowFn((rc:RunConfigurationState) => rc.containers));

  static sakuliConfig = createSelector(RunConfigurationSelect.feature, nothrowFn((rc:RunConfigurationState) => rc.configuration.sakuli));
  static isValid = createSelector(RunConfigurationSelect.feature, nothrowFn((rc: RunConfigurationState) => {
    const forceType = (type: RunConfigurationTypes) => typeof type === 'string' ? RunConfigurationTypes[type] : type;
    switch (forceType(rc.configuration.type)) {
      case RunConfigurationTypes.Local: {
        return true;
      }
      case RunConfigurationTypes.DockerCompose: {
        return rc.configuration.dockerCompose.file != null;
      }
      case RunConfigurationTypes.Dockerfile: {
        return rc.configuration.dockerfile.file != null;
      }
      case RunConfigurationTypes.SakuliContainer: {
        const {sakuli} = rc.configuration;
        return sakuli.container.name != null && sakuli.tag.name != null;
      }
      default: {
        return true;
      }
    }
  }, false));

  static selectedContainer = createSelector(
    RunConfigurationSelect.sakuliConfig,
    RunConfigurationSelect.containers,
    nothrowFn((sc: SakuliExecutionConfiguration, containers: SakuliContainer[]) => containers.find(c => c.name === sc.container.name))
  );

  static tags = createSelector(RunConfigurationSelect.feature, nothrowFn((rc:RunConfigurationState) => rc.tags));

  static tagsForSelectedContainer = createSelector(
    RunConfigurationSelect.selectedContainer,
    RunConfigurationSelect.tags,
    nothrowFn((c: SakuliContainer, t: {[id:string]:ContainerTag[]}) => t[c.name])
  )
}
