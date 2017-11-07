import {Injectable, Type} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ProjectModel} from "./model/project.model";

const projectUrl = '/api/project';

/**
 * @Deprecated
 */
@Injectable()
export class ProjectService {

  constructor(
    private http: Http
  ) {}

  open(path: string): Observable<ProjectModel> {
    return this.http.post(`${projectUrl}/open`, path)
      .mergeMap(r => this.activeProject())
  }

  activeProject(): Observable<ProjectModel> {
    return this.http.get(`${projectUrl}/active-project`)
      .map(r => r
        .json()
      )
      .catch(_ => Observable.of({}))
  }
}
