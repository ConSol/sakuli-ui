import {FontawesomeIcon} from "../icon/fontawesome-icon.utils";
import {Observable} from "rxjs/Observable";
import {CreateToast} from "./toast.service";

export const NGRX_TOAST_FEATURE_NAME = 'scToast';

export interface ToastConfig {
  ttl: number;
}

export interface ToastState {
  toasts: Toast[],
  history: Toast[]
  configuration: ToastConfig
}

export const ToastStateInit: ToastState = {
  toasts: [],
  history: [],
  configuration: {
    ttl: 30000
  }
}

export type ToastTypes = "success" | "info" | "warning" | "danger";

export interface Toast {
  type: ToastTypes;
  message: string;
  icon?: FontawesomeIcon
  more?: any
}

export class SuccessToast implements Toast {
  icon: FontawesomeIcon = 'fa-check';
  type: ToastTypes = 'success';

  constructor(readonly message: string) {
  }
}

export class DangerToast implements Toast {
  icon: FontawesomeIcon = 'fa-warning';
  type: ToastTypes = 'danger';
  more: any;

  constructor(readonly message: string,
              readonly error: Error | any) {
    if (error instanceof Error) {
      this.more = {
        name: error.name,
        message: error.message || '',
        stack: (error.stack || '').split('\n')
      }
    } else {
      this.more = error;
    }
  }
}

export interface ToastAppState {
  scToast: ToastState
}

export const ErrorMessage = (message: string) => (e: Error) => {
  return Observable.of(new CreateToast(new DangerToast(message, e)));
};
