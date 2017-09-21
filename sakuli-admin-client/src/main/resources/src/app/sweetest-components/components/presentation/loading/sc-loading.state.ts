import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {nothrow} from "nothrow";

export const ScLoadingFeatureName = 'scLoading';

export interface ScLoadingState {
  [id: string]: boolean
}

export const LOADING_SET_BUSY = '[loading] LOADING_SET_BUSY';
export class LoadingSetBusy implements Action {
  readonly type = LOADING_SET_BUSY;
  constructor(
    readonly id: string
  ) {}
}

export const LOADING_SET_IDLE = '[loading] LOADING_SET_IDLE';
export class LoadingSetIdle implements Action {
  readonly type = LOADING_SET_IDLE;
  constructor(
    readonly id: string
  ) {}
}

export type ScLoadingActions = LoadingSetBusy | LoadingSetIdle;

export function scLoadingReducer (state: ScLoadingState, action: ScLoadingActions): ScLoadingState {
  switch (action.type) {
    case LOADING_SET_BUSY: {
      return {...state, [action.id]: true}
    }
    case LOADING_SET_IDLE: {
      return {...state, [action.id]: false}
    }
  }
  return state || {};
}

export const loading = createFeatureSelector(ScLoadingFeatureName);
export const isLoading = (id: string) => createSelector(loading, s => nothrow(() => s[id] === true));
