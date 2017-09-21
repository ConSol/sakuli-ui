import {Toast, ToastAppState, ToastState} from "./toast-state.interface";
import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {ScToastService} from "./toast.service";

export const toastState = createFeatureSelector<ToastState>('scToast');

export const toastLength = createSelector(toastState, s => s ? s.toasts.length : 0);

const initState:ToastState = {
  toasts: [],
  configuration: {}
}

export function toastReducer(state:ToastState = initState, action:Action) {
  switch (action.type) {
    case ScToastService.actions.create:
      const {toast} = action as Action&{toast:Toast};
      return ({...state, toasts: [...state.toasts, toast]})
    case ScToastService.actions.remove:
      const {index} = action as Action&{index:number};
      return ({...state, toasts: state.toasts.filter((t,i) => i !== index)});
    default:
      return state;
  }
}
