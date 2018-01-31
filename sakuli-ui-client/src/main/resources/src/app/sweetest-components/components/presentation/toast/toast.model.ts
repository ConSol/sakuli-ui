import {FontawesomeIcon} from "../icon/fontawesome-icon.utils";
import {idGenerator} from "../../../utils";

const toastIdGen = idGenerator("toasts");

export interface ToastConfig {
  ttl: number;
}

export type ToastTypes = "success" | "info" | "warning" | "danger";

export interface IToast<T = null> {
  id: string;
  timestamp: Date;
  type: ToastTypes;
  message: string;
  icon?: FontawesomeIcon
  more?: T
}

export class Toast<T = null> implements IToast<T> {
  readonly id = toastIdGen.next().value;
  constructor(readonly message: string,
              readonly type: ToastTypes = 'info',
              readonly icon: FontawesomeIcon = 'fa-info',
              readonly timestamp = new Date()
  ) {  }
}

export class SuccessToast extends Toast {
  constructor(readonly message: string) {
    super(message, 'success', 'fa-check');
  }
}

export class WarningToast extends Toast {
  constructor(readonly message: string) {
    super(message, 'warning', 'fa-warning')
  }
}

export interface DangerMoreInfo {
  name: string;
  message: string;
  stack: string[];
}

export class DangerToast extends Toast<DangerMoreInfo> {
  more: DangerMoreInfo;

  constructor(readonly message: string,
              readonly error: Error | any) {
    super(message, 'danger', 'fa-warning');
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
