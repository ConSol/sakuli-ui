import {FontawesomeIcon} from "../icon/fontawesome-icon.utils";

export interface ToastState {
  toasts: Toast[],
  history: Toast[]
  configuration: {}
}

export const ToastStateInit: ToastState = {
  toasts: [],
  history: [],
  configuration: {}
}

export type ToastTypes = "success"|"info"|"warning"|"danger";

export interface Toast {
  type: ToastTypes;
  message: string;
  icon?: FontawesomeIcon
  more?: any
}

export interface ToastAppState {
  scToast: ToastState
}
