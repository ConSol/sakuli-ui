import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {Actions, Effect} from "@ngrx/effects";
import {IToast, ToastConfig} from "./toast.model";
import {selectToastId, ToastAppState, toastSelectors} from "./toast-state.interface";
import {CREATE_TOAST, CreateToast, RemoveToast} from "./toast.actions";


@Injectable()
export class ScToastService {

  toasts$: Observable<IToast[]> = this
    .store
    .select(toastSelectors.selectAll);

  constructor(
    private store: Store<ToastAppState>,
    readonly actions$: Actions
  ) {

  }


  get toastCount$() {
    return this.toasts$.map(toastSelectors.selectTotal);
  }

  create<T>(toast: IToast<T>) {
    this.store.dispatch(new CreateToast(toast))
  }

  remove(id: string) {
    this.store.dispatch(new RemoveToast(id))
  }

  @Effect() autoDelete$ = this.actions$
    .ofType(CREATE_TOAST)
    .withLatestFrom(this.store.select(toastSelectors.configuration))
    .delayWhen(([a, config]: [CreateToast, ToastConfig]) => {
      return config.ttl ?  Observable.interval(config.ttl) : Observable.empty();
    })
    .map(([a, config]: [CreateToast, ToastConfig]) => new RemoveToast(selectToastId(a.toast)))
}
