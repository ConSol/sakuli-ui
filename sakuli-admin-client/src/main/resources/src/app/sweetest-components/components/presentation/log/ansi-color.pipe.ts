import {Pipe, PipeTransform} from '@angular/core';
import {ansiRegEx} from "../../../utils";
const strip_ansi = require("strip-ansi");

@Pipe({
  name: 'ansiColors'
})
export class AnsiColorPipe implements PipeTransform {

  static readonly Styles = ([
    ['30m', [   0,   0,   0]],
    ['31m', [ 170,   0,   0]],
    ['32m', [   0, 170,   0]],
    ['33m', [ 170,  85,   0]],
    ['34m', [   0,   0, 170]],
    ['35m', [ 170,   0, 170]],
    ['36m', [   0, 170, 170]],
    ['37m', [ 170, 170, 170]],
  ] as [string, number[]][]).map(([code, rgb]) => `
    :host /deep/ .log-message-${code} {
      color: rgb(${rgb.join(', ')})
    }
  `).join('\n');

  constructor(){}

  transform(message: string, ...args: any[]): any {
    const parts = Array.from(
      message.match(ansiRegEx()) || [],
      m => m
    )
      .map(m => ({token: m, position: message.indexOf(m)}))
      .concat({token: '', position: message.length - 1})
      .map((index, i, a) => ([index, a[i + 1] || {token: '', position: message.length - 1}]))
      .filter(([start, end]) => start.position !== end.position)
      .filter(([start]) => start.token.endsWith('m'))
      .map(([start, end]) => `<span class="${this.tokenClass(start.token)}">${
        strip_ansi(message
        .slice(start.position, end.position))
      }</span>`)
      .join('');
    return parts;
  }

  tokenClass(token: string) {
    const clsName = `log-message-${token.slice(2)}`;
    return clsName;
  }
}
