import {Action} from "@ngrx/store";
import {Request} from "@angular/http";
import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {ScModalService} from "../../components/presentation/modal/sc-modal.service";
import {ScLoginComponent} from "./auth/sc-login.component";

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
  constructor(
    readonly actions$: Actions,
    readonly scModal: ScModalService
  ) {}

  @Effect({dispatch: false}) error401$ = this.actions$.ofType(HTTP_ERROR)
    .filter((a: HttpError) => a.code === 401 || a.code === 403)
    .do(async (a) => {
      let modal: ScLoginComponent;
      if(!this.isModalOpen) {
        this.isModalOpen = true;
        console.log('Open');
        await this.scModal.open(ScLoginComponent, {}, m => modal = m);
        this.isModalOpen = false;
        console.log('close');
      }
    })
}
