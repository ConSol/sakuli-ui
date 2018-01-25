import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AppInfo} from "./model/app-info.interface";

@Injectable()
export class AppInfoService {

  info$: Observable<AppInfo>;

  constructor(
    readonly http: HttpClient
  ) {}

  getAppInfo(): Observable<AppInfo> {
    if(!this.info$) {
    this.info$ = this.http
      .get<AppInfo>('/api/info')
      .publishReplay(1)
      .refCount();
    }
    return this.info$;
  }

}
