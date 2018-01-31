import {Pipe, PipeTransform} from "@angular/core";
import {fileName, pathName} from "./file.utils";
import {absPath, FileResponse} from "../../services/access/model/file-response.interface";

@Pipe({name: 'fileName'})
export class FileNamePipe implements PipeTransform {
  transform(value: string) {
    return fileName(value);
  }
}


@Pipe({name: 'path'})
export class PathPipe implements PipeTransform {
  transform(value: string) {
    return pathName(fileName(value));
  }
}


@Pipe({name: 'absPath'})
export class AbsPathPipe implements PipeTransform {
  transform(value: FileResponse) {
    return absPath(value);
  }
}
