import {FileSelectorFile} from "./file-selector.state";
import * as path from 'path';

export type FileSelectorFilter = (file:FileSelectorFile) => boolean;
export type FileSelectorSort = ((f1:FileSelectorFile) => any)[]

export class Filters {

  static extension(...ext:string[]) {
    return (file:FileSelectorFile) => {
      const fileExt = path.extname(file.name);
      const i = ext.includes(fileExt);
      console.log(i, file.name, fileExt, ext);
      return i;
    }
  }

  static isDirectory() {
    return (file: FileSelectorFile) => {
      return file.directory;
    }
  }

  static isFile() {
    const isDir = Filters.isDirectory();
    return (file: FileSelectorFile) => !isDir(file)
  }

  static filename(test:string | RegExp) {
    return (file: FileSelectorFile) => {
      if(test instanceof RegExp) {
        return test.test(file.name)
      } else {
        return test === file.name;
      }
    }
  }

  static and(...filters: FileSelectorFilter[]) {
    function apply(file: FileSelectorFile, [a, ...rest]: FileSelectorFilter[]) {
      return a(file) ? apply(file, rest) : false;
    }
    return (file:FileSelectorFile) => {
      return apply(file, filters);
    }
  }

  static or(...filters: FileSelectorFilter[] ) {
    function apply(file: FileSelectorFile, [a, ...rest]: FileSelectorFilter[]) {
      return a(file) ? true : apply(file, rest);
    }
    return (file:FileSelectorFile) => {
      return apply(file, filters);
    }
  }

}
