import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";

import {Injectable} from "@angular/core";
import {RouterGo} from "../../router/router.actions";

@Injectable()
export class ScAuthInterceptorService implements HttpInterceptor {

  constructor(
    readonly store: Store<any>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 402) {
          this.store.dispatch(new RouterGo({path: ['login']}))
        }
      }
    });
  }



}
