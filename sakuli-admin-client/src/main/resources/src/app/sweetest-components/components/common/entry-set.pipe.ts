import {Pipe, PipeTransform} from '@angular/core';

export interface Entry<T> {
  key: string;
  value: T
}

export type EntrySet<T> = Entry<T>[];

@Pipe({
  name: 'entries'
})
export class ScEntrySetPipe implements PipeTransform {
  transform<T>(value: {[key:string]:T}, ...args: any[]): EntrySet<T> {
    return Object
      .keys(value)
      .reduce((es, k) => {
        return [...es, {key: k, value: value[k]}]
      }, [] as EntrySet<T>)
  }
}
