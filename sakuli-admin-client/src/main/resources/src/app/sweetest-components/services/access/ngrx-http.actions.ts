import {Request as HttpRequest, Response} from "@angular/http";
import {Action} from "@ngrx/store";

export const REQUEST_ACTIONS = {
  start: 'request.start',
  success: 'request.success',
  error: 'request.error'
};

export class RequestSuccess implements Action {
  type = REQUEST_ACTIONS.success;

  constructor(readonly correlationId: string,
              readonly response: Response) {
  }
}

export class RequestError implements Action {
  type = REQUEST_ACTIONS.error;

  constructor(readonly correlationId: string,
              readonly error: any) {

  }
}

export class Request implements Action {
  readonly type = REQUEST_ACTIONS.start;
  private static requestCount = 0;
  private _requestId;

  constructor(readonly request: HttpRequest) {
    this._requestId = 'request-' + ++Request.requestCount;
  }

  get correlationId() {
    return this._requestId;
  }

  success(response: Response) {
    return new RequestSuccess(
      this.correlationId,
      response
    )
  }

  error(e: any) {
    return new RequestError(
      this.correlationId,
      e
    )
  }
}
