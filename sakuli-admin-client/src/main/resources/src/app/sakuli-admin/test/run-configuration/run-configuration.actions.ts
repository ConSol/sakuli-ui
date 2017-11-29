import {Action} from "@ngrx/store";
import {uniqueName} from "../../../core/redux.util";
import {ContainerTag, RunConfiguration, SakuliContainer} from "./run-configuration.interface";

export const LOAD_RUN_CONFIGURATION = uniqueName('[run-configuration] LOAD_RUN_CONFIGURATION');
export class LoadRunConfiguration implements Action {
  readonly type = LOAD_RUN_CONFIGURATION;
  constructor(
    readonly path: string
  ) {}
}


export const LOAD_RUN_CONFIGURATION_SUCCESS = uniqueName('[run-configuration] LOAD_RUN_CONFIGURATION_SUCCESS');
export class LoadRunConfigurationSuccess implements Action {
  readonly type = LOAD_RUN_CONFIGURATION_SUCCESS;
  constructor(
    readonly runConfiguration: RunConfiguration
  ) {}
}


export const SAVE_RUN_CONFIGURATION = uniqueName('[run-configuration] SAVE_RUN_CONFIGURATION');
export class SaveRunConfiguration implements Action {
  readonly type = SAVE_RUN_CONFIGURATION;
  constructor(
    readonly path: string,
    readonly runConfiguration: RunConfiguration
  ) {}
}

export const SAVE_RUN_CONFIGURATION_SUCCESS = uniqueName('[run-configuration] SAVE_RUN_CONFIGURATION_SUCCESS');
export class SaveRunConfigurationSuccess implements Action {
  readonly type = SAVE_RUN_CONFIGURATION_SUCCESS;
  constructor(
  ) {}
}

export const LOAD_SAKULI_CONTAINER = uniqueName('[run-configuration] LOAD_SAKULI_CONTAINER');
export class LoadSakuliContainer implements Action {
  readonly type = LOAD_SAKULI_CONTAINER;
  constructor() {}
}

export const LOAD_SAKULI_CONTAINER_SUCCESS = uniqueName('[run-configuration] LOAD_SAKULI_CONTAINER_SUCCESS');
export class LoadSakuliContainerSuccess implements Action {
  readonly type = LOAD_SAKULI_CONTAINER_SUCCESS;
  constructor(
    readonly containers: SakuliContainer[]
  ) {}
}

export const SELECT_SAKULI_CONTAINER = uniqueName('[run-configuration] SELECT_SAKULI_CONTAINER');
export class SelectSakuliContainer implements Action {
  readonly type = SELECT_SAKULI_CONTAINER;
  constructor(
    readonly container: SakuliContainer
  ) {}
}

export const LOAD_SAKULI_CONTAINER_TAGS = uniqueName('[run-configuration] LOAD_SAKULI_CONTAINER_TAGS');
export class LoadSakuliContainerTags implements Action {
  readonly type = LOAD_SAKULI_CONTAINER_TAGS;
  constructor(
    readonly container: SakuliContainer
  ) {}
}

export const LOAD_SAKULI_CONTAINER_TAGS_SUCCESS = uniqueName('[run-configuration] LOAD_SAKULI_CONTAINER_TAGS_SUCCESS');
export class LoadSakuliContainerTagsSuccess implements Action {
  readonly type = LOAD_SAKULI_CONTAINER_TAGS_SUCCESS;
  constructor(
    readonly container: SakuliContainer,
    readonly tags: ContainerTag[]
  ) {}
}


export type RunConfigurationActions =
  SaveRunConfiguration |
  SaveRunConfigurationSuccess |
  LoadRunConfiguration |
  LoadRunConfigurationSuccess |
  LoadSakuliContainer |
  LoadSakuliContainerSuccess |
  SelectSakuliContainer |
  LoadSakuliContainerTags |
  LoadSakuliContainerTagsSuccess
  ;
