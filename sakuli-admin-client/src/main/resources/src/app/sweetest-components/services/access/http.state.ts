import {Action, Store} from "@ngrx/store";
import {Request} from "@angular/http";
import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {ScModalService} from "../../components/presentation/modal/sc-modal.service";
import {RouterGo} from "../router/router.actions";

export const HTTP_ERROR = '[ERROR] HTTP';
export class HttpError implements Action {
  readonly type = HTTP_ERROR;
  constructor(
    readonly code,
    readonly request: string | Request
  ) {}
}


@Injectable()
export class HttpEffects {
  private isModalOpen = false;
  private actions: Action[] = [];

  constructor(
    readonly actions$: Actions,
    readonly scModal: ScModalService,
    readonly store:Store<any>
  ) {}


  @Effect({dispatch: false}) error401$ = this.actions$.ofType(HTTP_ERROR)
    .filter((a: HttpError) => a.code === 401 || a.code === 403)
    .do(async (a) => {
      this.scModal.closeAll();
      this.store.dispatch(new RouterGo({path: ['/login']}))
    })
}
