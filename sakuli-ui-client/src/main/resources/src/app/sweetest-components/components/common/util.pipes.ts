import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return (value || '').split(args[0]);
  }
}

@Pipe({
  name: 'concat'
})
export class ConcatPipe implements PipeTransform {
  transform(value: any[], ...args: any[]): any {
    return (value || []).concat(Array.isArray(args[0]) ? args[0] : args);
  }
}

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(
    readonly sanitizer: DomSanitizer
  ){}

  transform(value: string, ...args: any[]): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return Number(value).toPrecision(args[0] | 2);
  }
}
