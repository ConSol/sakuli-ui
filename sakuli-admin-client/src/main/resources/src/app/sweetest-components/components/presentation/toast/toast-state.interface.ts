import {createFeatureSelector, createSelector} from "@ngrx/store";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {DangerToast, IToast, ToastConfig} from "./toast.model";

export const NGRX_TOAST_FEATURE_NAME = 'scToast';

export interface ToastState extends EntityState<IToast> {
  history: IToast<any>[]
  configuration: ToastConfig
}

export const selectToastId = (toast: IToast) => toast.id;
export const sortToasts = (t1: IToast, t2: IToast) => t1.timestamp.getDate() - t2.timestamp.getDate();
export const toastEntityAdapter = createEntityAdapter({
  selectId: selectToastId,
  sortComparer: sortToasts
});

export const ToastStateInit: ToastState = {
  ...toastEntityAdapter.getInitialState(),
  history: [
    new DangerToast("This was an error", Error('nothin good happend')),
    new DangerToast("This was an error", Error('nothin good happend'))
  ],
  configuration: {
    ttl: 30000
  }
};



export interface ToastAppState {
  scToast: ToastState
}



const state = createFeatureSelector<ToastState>(NGRX_TOAST_FEATURE_NAME);
const selectors = toastEntityAdapter.getSelectors(state);
const configuration = createSelector(state, s => s.configuration);
const history = createSelector(state, s => s.history);
const ttl = createSelector(configuration, c => c.ttl);
export const toastSelectors = {
  configuration,
  history,
  ttl,
  ...selectors
};
