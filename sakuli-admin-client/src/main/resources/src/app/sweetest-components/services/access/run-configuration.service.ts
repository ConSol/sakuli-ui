import {Injectable, Type} from '@angular/core';
import {} from '@angular/common'
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FileResponse} from "./model/file-response.interface";
import {ProjectModel} from "./model/project.model";
import {ActionCreator} from "../ngrx-util/action-creator-metadata";
import {RunConfiguration} from "../../../sakuli-admin/test/run-configuration/run-configuration.interface";

const runConfigUrl = '/api/run-configuration';

@Injectable()
export class RunConfigurationService {

  constructor(
    private http: Http
  ) {}

  getRunConfiguration(): Observable<RunConfiguration> {
    return this.http.get(`${runConfigUrl}`)
      .map(r => r.json())
  }

  saveRunConfiguration(runConfiguration: RunConfiguration): Observable<any> {
    return this.http.post(`${runConfigUrl}`, runConfiguration)
      .map(r => r.json())
      .catch(_ => Observable.of({}))
  }

  loadSakuliContainer() {
    return this.http.get(`${runConfigUrl}/sakuli-container`)
      .map(r => r.json())
      .catch(_ => Observable.of([]))
  }

  loadSakuliContainerTags(container: string) {
    return this.http.get(`${runConfigUrl}/sakuli-container/${container}/tags`)
      .map(r => r.json())
      .catch(_ => Observable.of([]))
  }
}
