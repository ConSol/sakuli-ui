import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FileResponse, FileWithContent} from "./model/file-response.interface";
import {jsonOrDefault} from "./http.util";

const projectUrl = '/api/files';

export const rmHeadSlash = (p: string = '') => p.slice(p.startsWith("/") ? 1 : 0);

@Injectable()
export class FileService {

  constructor(
    private http: Http
  ) {}

  files(path: string = ''): Observable<FileResponse[]> {
    return this.http
      .get(`${projectUrl}/ls?path=${rmHeadSlash(path || '')}`)
      .map(jsonOrDefault([]))
      .map(fr => fr
        .sort((a, b) => (a.name.toLowerCase() === b.name.toLowerCase()) ? 0 : (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1)
        .sort((a, b) => (a.directory && b.directory) ? 0 : (!a.directory && b.directory) ? 1 : -1)
      )
  }

  readAllFiles(files: string[] = []): Observable<FileWithContent[]> {
    return Observable.forkJoin(
      ...files.map(file => this.read(file).map(content => ({file, content})))
    )
  }

  read(path: string): Observable<string> {
    return this.http
      .get(`${projectUrl}?path=${rmHeadSlash(path)}`)
      .map(r => r.text())
  }

  write(path: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post(`${projectUrl}?path=${rmHeadSlash(path)}/${file.name}`, formData)
      .map(r => r.toString())
  }

  delete(file: string) {
    return this.http
      .delete(`${projectUrl}?path=${file}`)
      .map(r => r.toString());
  }
}
