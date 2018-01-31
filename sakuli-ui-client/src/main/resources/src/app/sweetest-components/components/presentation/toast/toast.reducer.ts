import {toastEntityAdapter, ToastState, ToastStateInit} from "./toast-state.interface";
import {CREATE_TOAST, REMOVE_TOAST, ToastActions} from "./toast.actions";

export function toastReducer(state:ToastState = ToastStateInit, action: ToastActions) {
  switch (action.type) {
    case CREATE_TOAST:
      const {toast} = action;

      return ({...toastEntityAdapter.addOne(toast, state),
        history: [...state.history, toast]
      });
    case REMOVE_TOAST:
      const {id} = action;
      return toastEntityAdapter.removeOne(id, state);
    default:
      return state;
  }
}
