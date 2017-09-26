import {Injectable} from "@angular/core";
import {Actions} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {LoadingSetBusy, LoadingSetIdle, ScLoadingState} from "./sc-loading.state";

@Injectable()
export class ScLoadingService {

  constructor(
    readonly actions$: Actions,
    readonly store: Store<{scLoading: ScLoadingState}>
  ) {}

  registerLoadingActions(id: string, isLoading: string, finishLoading: string) {
    return this.actions$
      .ofType(isLoading, finishLoading)
      .map(a => {
        if(a.type === isLoading) {
          return new LoadingSetBusy(id);
        } else {
          return new LoadingSetIdle(id);
        }
      })

  }

}
