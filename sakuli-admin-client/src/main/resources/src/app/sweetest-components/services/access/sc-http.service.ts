import {Http, RequestOptions, RequestOptionsArgs, Response, Request, XHRBackend, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {HttpError} from "./http.state";
import {TokenService} from "./token.service";
import {Injectable} from "@angular/core";

const isRequest = (url: string | Request): url is Request => {
  return "url" in  (url as any);
};

export function ScHttpServiceProvider(backend: XHRBackend, options: RequestOptions, token: TokenService, store: Store<any>) {
  return new ScHttpService(backend, options, token, store);
}

@Injectable()
export class ScHttpService extends Http {
  constructor(
    backend: XHRBackend,
    options: RequestOptions,
    readonly token: TokenService,
    readonly store: Store<any>,
  ) {
    super(backend, options);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    if (!options) {
      options = {headers: new Headers()};
    } else if(!options.headers) {
      options.headers = new Headers();
    }
    console.log(this.token, this.token.hasToken());
    if(this.token.hasToken()) {
      if(isRequest(url)) {
        if(!url.headers) {
          url.headers = new Headers();
        }
        url.headers.append('Authorization', this.token.getPrefixedToken())
      }
      options.headers.append('Authorization', this.token.getPrefixedToken());
    }
    console.log(url, options);
    return super
      .request(url, options)
      .map(res => {
        if(res.status < 200 || res.status >= 300) {
          this.store.dispatch(new HttpError(res.status, url));
        }
        return res;
      })
      .catch(e => {
        this.store.dispatch(new HttpError(e.status, url));
        return Observable.of(e);
      })
      ;
  }
}
