import {ProjectState, ProjectStateInit} from "./project/state/project.interface";
import {TestState, TestStateInit} from "./test/state/test.interface";
import {
  ToastAppState, ToastState,
  ToastStateInit
} from "../sweetest-components/components/presentation/toast/toast-state.interface";
import {AssetsState, AssetsStateInit} from "./test/test-detail/tabs/sa-assets/sa-assets.interface";
import {Action} from "@ngrx/store";

export interface AppStateBase {
  project: ProjectState,
  test: TestState,
  assets: AssetsState
}

export type AppState = AppStateBase & ToastAppState;

export const AppStateInit: AppState = {
  project: ProjectStateInit,
  test: TestStateInit,
  assets: AssetsStateInit,
  scToast: ToastStateInit
}

export function initReducer(state: AppState = AppStateInit, action: Action) {
  return state || AppStateInit;
}
