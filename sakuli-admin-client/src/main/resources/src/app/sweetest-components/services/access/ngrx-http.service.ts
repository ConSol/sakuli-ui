import {Injectable} from "@angular/core";
import {ConnectionBackend, Http, RequestOptions, Request as HttpRequest} from "@angular/http";
import {Request} from "./ngrx-http.actions"
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {Actions, Effect} from "@ngrx/effects";
import {REQUEST_ACTIONS, RequestSuccess} from "./ngrx-http.actions";
import {log} from "../../../core/redux.util";

@Injectable()
export class NgrxHttpService extends Http {
  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions,
              private store: Store<any>,
              private actions$: Actions) {
    super(backend, defaultOptions);
  }

  @Effect() start$ = this.actions$.ofType(REQUEST_ACTIONS.start).mergeMap((a: Request) => {
    console.log('Effect dfgdgd')
    return super.request(a.request)
      .map(r => a.success(r))
      .catch(e => {
        return Observable.of(a.error(e));
      })
  });

  request(request: HttpRequest, options: RequestOptions) {
    const requestAction = new Request(request);
    this.store.dispatch(requestAction);
    return this.actions$.ofType(REQUEST_ACTIONS.success)
      .filter((a: RequestSuccess) => a.correlationId === requestAction.correlationId)
      .first()
      .map((a: RequestSuccess) => a.response)

  }
}
