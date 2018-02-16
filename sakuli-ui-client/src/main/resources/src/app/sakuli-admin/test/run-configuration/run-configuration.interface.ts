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
