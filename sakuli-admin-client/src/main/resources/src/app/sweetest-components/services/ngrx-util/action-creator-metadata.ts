import {Type} from "@angular/core";


export const ACTION_CREATOR_METADATA_KEY = "ngrx-utils: actionCreatorMetadataKey";
const r: any = Reflect;

export interface ActionCreatorConfig {
  autoSubscribe: boolean;

}

const ActionCreatorDefaultConfig: ActionCreatorConfig = {
  autoSubscribe: true
}

export function ActionCreator(config: ActionCreatorConfig = ActionCreatorDefaultConfig) {
  return function(target: Object, key: string, descriptor: PropertyDescriptor) {
    r.defineMetadata(ACTION_CREATOR_METADATA_KEY, {...config, ...ActionCreatorDefaultConfig}, target, key);
  }
}

export enum AsyncActionLifecycle {
  Init, Success, Error
}

export const FEATURE_ACTION_CREATOR_METADATA_KEY = 'ngrx-utils: featureActionCreatorMetadataKey';
export function actionTypeFor<T>(type: Type<T>, creatorMethod: keyof T, asyncActionLifecycle = AsyncActionLifecycle.Init) {
  const featureName = r.getMetadata(FEATURE_ACTION_CREATOR_METADATA_KEY, type) || '';
  const lifecyclePhase = AsyncActionLifecycle[asyncActionLifecycle];
  return [featureName, type.name, creatorMethod, lifecyclePhase].filter(s => s.length).join('.');
}
