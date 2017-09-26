import {Injectable} from "@angular/core";
import {Action, Store} from "@ngrx/store";
import {
  Toast, ToastAppState,
} from "app/sweetest-components/components/presentation/toast/toast-state.interface";
import {Name} from "../../../../core/redux.util";

export const CREATE_TOAST = Name('[sc-toast] CREATE_TOAST');
export class CreateToast implements Action {
  readonly type = CREATE_TOAST
  constructor(
    readonly toast: Toast
  ) {}
}

export const REMOVE_TOAST = Name('[sc-toast] REMOVE_TOAST');
export class RemoveToast implements Action {
  readonly type = REMOVE_TOAST
  constructor(
    readonly index: number
  ) {}
}

@Injectable()
export class ScToastService {

  static actions = {
    create: CREATE_TOAST,
    remove: REMOVE_TOAST
  };

  constructor(
    private store: Store<ToastAppState>
  ) {}

  get toasts$() {
    return this.store.select(s => s.scToast.toasts);
  }

  get toastCount$() {
    return this.toasts$.map(t => t.length);
  }

  create(toast: Toast) {
    this.store.dispatch(new CreateToast(toast))
  }

  remove(index: number) {
    this.store.dispatch(new RemoveToast(index))
  }



}
