import {Injectable} from "@angular/core";
import {Action, Store} from "@ngrx/store";
import {
  Toast, ToastAppState,
} from "app/sweetest-components/components/presentation/toast/toast-state.interface";
import {uniqueName} from "../../../../core/redux.util";
import {Observable} from "rxjs/Observable";

export const CREATE_TOAST = uniqueName('[sc-toast] CREATE_TOAST');
export class CreateToast implements Action {
  readonly type = CREATE_TOAST;
  constructor(
    readonly toast: Toast
  ) {}
}

export const REMOVE_TOAST = uniqueName('[sc-toast] REMOVE_TOAST');
export class RemoveToast implements Action {
  readonly type = REMOVE_TOAST;
  constructor(
    readonly index: number
  ) {}
}

export type ToastActions = CreateToast | RemoveToast;

@Injectable()
export class ScToastService {

  constructor(
    private store: Store<ToastAppState>
  ) {}

  get toasts$(): Observable<Toast[]> {
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
