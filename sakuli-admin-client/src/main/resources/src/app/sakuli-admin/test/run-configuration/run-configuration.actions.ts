import {Action} from "@ngrx/store";
import {Name} from "../../../core/redux.util";
import {ContainerTag, RunConfiguration, SakuliContainer} from "./run-configuration.interface";

export const LOAD_RUN_CONFIGURATION = Name('[run-configuration] LOAD_RUN_CONFIGURATION');
export class LoadRunConfiguration implements Action {
  readonly type = LOAD_RUN_CONFIGURATION;
  constructor() {}
}


export const LOAD_RUN_CONFIGURATION_SUCCESS = Name('[run-configuration] LOAD_RUN_CONFIGURATION_SUCCESS');
export class LoadRunConfigurationSuccess implements Action {
  readonly type = LOAD_RUN_CONFIGURATION_SUCCESS;
  constructor(
    readonly runConfiguration: RunConfiguration
  ) {}
}


export const SAVE_RUN_CONFIGURATION = Name('[run-configuration] SAVE_RUN_CONFIGURATION');
export class SaveRunConfiguration implements Action {
  readonly type = SAVE_RUN_CONFIGURATION;
  constructor(
    readonly runConfiguration: RunConfiguration
  ) {}
}

export const SAVE_RUN_CONFIGURATION_SUCCESS = Name('[run-configuration] SAVE_RUN_CONFIGURATION_SUCCESS');
export class SaveRunConfigurationSuccess implements Action {
  readonly type = SAVE_RUN_CONFIGURATION_SUCCESS;
  constructor(
  ) {}
}

export const LOAD_SAKULI_CONTAINER = Name('[run-configuration] LOAD_SAKULI_CONTAINER');
export class LoadSakuliContainer implements Action {
  readonly type = LOAD_SAKULI_CONTAINER
  constructor() {}
}

export const LOAD_SAKULI_CONTAINER_SUCCESS = Name('[run-configuration] LOAD_SAKULI_CONTAINER_SUCCESS');
export class LoadSakuliContainerSuccess implements Action {
  readonly type = LOAD_SAKULI_CONTAINER_SUCCESS;
  constructor(
    readonly containers: SakuliContainer[]
  ) {}
}

export const SELECT_SAKULI_CONTAINER = Name('[run-configuration] SELECT_SAKULI_CONTAINER');
export class SelectSakuliContainer implements Action {
  readonly type = SELECT_SAKULI_CONTAINER;
  constructor(
    readonly container: SakuliContainer
  ) {}
}

export const LOAD_SAKULI_CONTAINER_TAGS = Name('[run-configuration] LOAD_SAKULI_CONTAINER_TAGS');
export class LoadSakuliContainerTags implements Action {
  readonly type = LOAD_SAKULI_CONTAINER_TAGS;
  constructor(
    readonly container: SakuliContainer
  ) {}
}

export const LOAD_SAKULI_CONTAINER_TAGS_SUCCESS = Name('[run-configuration] LOAD_SAKULI_CONTAINER_TAGS_SUCCESS');
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
