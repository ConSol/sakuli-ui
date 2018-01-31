import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {authSelectors} from "./auth.state";

@Injectable()
export class ScTokenInterceptorService implements HttpInterceptor {

  constructor(
    readonly store: Store<any>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store
      .select(authSelectors.token())
      .first()
      .mergeMap(token => {
        if(token) {
          const nextRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(nextRequest);
        }
        return next.handle(req);
      })

  }

}
