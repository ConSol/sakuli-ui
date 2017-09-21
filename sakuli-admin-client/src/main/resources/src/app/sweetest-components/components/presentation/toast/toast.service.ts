import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {
  Toast, ToastAppState,
  ToastState
} from "app/sweetest-components/components/presentation/toast/toast-state.interface";

@Injectable()
export class ScToastService {

  static actions = {
    create: 'toast.create',
    remove: 'toast.remove'
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
    this.store.dispatch({
      type: ScToastService.actions.create,
      toast
    })
  }

  remove(index: number) {
    this.store.dispatch({
      type: ScToastService.actions.remove,
      index
    })
  }



}
