export interface ToastState {
  toasts: Toast[]
  configuration: {}
}

export const ToastStateInit: ToastState = {
  toasts: [],
  configuration: {}
}

export type ToastTypes = "success"|"info"|"warning"|"danger";

export interface Toast {
  type: ToastTypes;
  message: string;
}

export interface ToastAppState {
  scToast: ToastState
}
