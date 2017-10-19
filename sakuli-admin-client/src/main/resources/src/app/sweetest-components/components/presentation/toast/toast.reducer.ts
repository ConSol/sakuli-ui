import {NGRX_TOAST_FEATURE_NAME, ToastState, ToastStateInit} from "./toast-state.interface";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CREATE_TOAST, REMOVE_TOAST, ToastActions} from "./toast.service";
import {nothrowFn} from "../../../../core/utils";

export const toastState = createFeatureSelector<ToastState>(NGRX_TOAST_FEATURE_NAME);

export const toastHistory = createSelector(
  toastState,
  nothrowFn(ts => ts.history)
);

export const toastLength = createSelector(toastState, s => s ? s.toasts.length : 0);

export function toastReducer(state:ToastState = ToastStateInit, action: ToastActions) {
  switch (action.type) {
    case CREATE_TOAST:
      const {toast} = action;
      return ({...state,
        toasts: [...state.toasts, toast],
        history: [...state.history, toast]
      });
    case REMOVE_TOAST:
      const {index} = action;
      return ({...state,
        toasts: state.toasts.filter((t,i) => i !== index),
      });
    default:
      return state;
  }
}
