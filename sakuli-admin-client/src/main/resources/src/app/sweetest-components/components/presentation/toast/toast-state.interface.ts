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

export class SuccessToast implements Toast {
  icon: FontawesomeIcon = 'fa-check';
  type:ToastTypes = 'success';
  constructor(
    readonly message: string
  ) {}
}

export class DangerToast implements Toast {
  icon: FontawesomeIcon = 'fa-warning';
  type: ToastTypes = 'danger';
  more: any;
  constructor(
    readonly message: string,
    readonly error: Error
  ) {
    this.more = {
      name: error.name,
      message: error.message,
      stack: error.stack.split('\n')
    }
  }
}

export interface ToastAppState {
  scToast: ToastState
}
