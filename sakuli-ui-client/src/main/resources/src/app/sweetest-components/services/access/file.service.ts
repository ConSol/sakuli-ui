import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {FileResponse, FileWithContent} from "./model/file-response.interface";
import {HttpClient} from "@angular/common/http";

const projectUrl = '/api/files';

export const rmHeadSlashAndEncode = (p: string = '') => encodeURIComponent(p.slice(p.startsWith("/") ? 1 : 0));

@Injectable()
export class FileService {

  constructor(private http: HttpClient) {
  }

  files(path: string = ''): Observable<FileResponse[]> {
    return this.http
      .get<FileResponse[]>(`${projectUrl}/ls?path=${rmHeadSlashAndEncode(path || '')}`)
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
      .get(
        `${projectUrl}?path=${rmHeadSlashAndEncode(path)}`,
        {responseType: 'text'}
      )
  }

  write(path: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post(
        `${projectUrl}?path=${rmHeadSlashAndEncode(path)}/${file.name}`,
        formData,
        {responseType: 'text'}
      )
  }

  delete(file: string) {
    return this.http
      .delete(
        `${projectUrl}?path=${encodeURIComponent(file)}`,
        {responseType: 'text'}
      )

  }
}
