import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name:'urlComponent'})
export class UrlComponentPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    return encodeURIComponent(value);
  }

}
