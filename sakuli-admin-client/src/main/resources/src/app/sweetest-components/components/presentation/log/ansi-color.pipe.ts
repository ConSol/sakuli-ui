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

  transform(message: string, ...args: any[]): string {

    const parts = message.split(ansiRegEx()).reverse();
    const tokens = Array.from(message.match(ansiRegEx()) || []).reverse();

    return parts.map((p, i) => {
      const token = tokens[i];
      if(token) {
        return `<span class="${this.tokenClass(token)}">${p}</span>`
      } else {
        return p;
      }
    }).reverse().join('');
  }

  tokenClass(token: string) {
    const clsName = `log-message-${token.slice(2)}`;
    return clsName;
  }
}
