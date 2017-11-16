import {uniqueName} from "../../../../core/redux.util";
import {Action} from "@ngrx/store";
import {DangerToast, IToast} from "./toast.model";
import {Observable} from "rxjs/Observable";

export const CREATE_TOAST = uniqueName('[sc-toast] CREATE_TOAST');
export class CreateToast<T = null> implements Action {
  readonly type = CREATE_TOAST;
  constructor(
    readonly toast: IToast<T>
  ) {}
}

export const REMOVE_TOAST = uniqueName('[sc-toast] REMOVE_TOAST');
export class RemoveToast implements Action {
  readonly type = REMOVE_TOAST;
  constructor(
    readonly id: string
  ) {}
}

export type ToastActions = CreateToast | RemoveToast;

export const ErrorMessage = (message: string) => (e: Error) => {
  return Observable.of(new CreateToast(new DangerToast(message, e)));
};
