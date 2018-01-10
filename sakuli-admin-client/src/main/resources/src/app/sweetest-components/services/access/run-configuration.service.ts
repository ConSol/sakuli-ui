import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {RunConfiguration} from "../../../sakuli-admin/test/run-configuration/run-configuration.interface";
import {HttpClient} from "@angular/common/http";

const runConfigUrl = '/api/run-configuration';

@Injectable()
export class RunConfigurationService {

  constructor(
    private http: HttpClient
  ) {}

  getRunConfiguration(path: string): Observable<RunConfiguration> {
    return this.http.get<RunConfiguration>(`${runConfigUrl}?path=${path}`)
  }

  saveRunConfiguration(path: string, runConfiguration: RunConfiguration): Observable<any> {
    return this.http.post(`${runConfigUrl}?path=${path}`, runConfiguration)
      .catch(_ => Observable.of({}))
  }

  loadSakuliContainer() {
    return this.http.get(`${runConfigUrl}/sakuli-container`)
      .catch(_ => Observable.of([]))
  }

  loadSakuliContainerTags(container: string) {
    return this.http.get(`${runConfigUrl}/sakuli-container/${container}/tags`)
      .catch(_ => Observable.of([]))
  }
}
