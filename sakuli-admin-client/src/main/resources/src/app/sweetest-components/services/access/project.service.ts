import {Injectable, Type} from '@angular/core';
import {} from '@angular/common'
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FileResponse} from "./model/file-response.interface";
import {ProjectModel} from "./model/project.model";
import {ActionCreator} from "../ngrx-util/action-creator-metadata";

const projectUrl = '/api/project';

@Injectable()
export class ProjectService {

  constructor(
    private http: Http
  ) {}

  open(path: string): Observable<ProjectModel> {
    return this.http.post(`${projectUrl}/open`, path)
      .mergeMap(r => this.activeProject())
  }

  @ActionCreator()
  activeProject(): Observable<ProjectModel> {
    return this.http.get(`${projectUrl}/active-project`)
      .map(r => r
        .json()
      )
      .catch(_ => Observable.of({}))
  }
}
