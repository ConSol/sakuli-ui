import {Injectable} from "@angular/core";
import {Actions} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {LoadingSetBusy, LoadingSetIdle, ScLoadingState} from "./sc-loading.state";

@Injectable()
export class ScLoadingService {

  constructor(
    readonly actions$: Actions,
    readonly store: Store<{scLoading: ScLoadingState}>
  ) {}

  registerLoadingActions(id: string, isLoading: string[], finishLoading: string[])
  registerLoadingActions(id: string, isLoading: string, finishLoading: string)
  registerLoadingActions(id: string, isLoading: string|string[], finishLoading: string|string[]) {
    if(!Array.isArray(isLoading)) { isLoading = [isLoading]}
    if(!Array.isArray(finishLoading)) { finishLoading = [finishLoading]}
    return this.actions$
      .ofType(...[...isLoading, ...finishLoading])
      .map(a => {
        if(isLoading.includes(a.type)) {
          return new LoadingSetBusy(id);
        } else {
          return new LoadingSetIdle(id);
        }
      })

  }

}
