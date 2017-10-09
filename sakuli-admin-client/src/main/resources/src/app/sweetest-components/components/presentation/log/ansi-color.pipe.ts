import {Pipe, PipeTransform} from '@angular/core';
import {ansiRegEx} from "../../../utils";

const strip_ansi = require("strip-ansi");

@Pipe({
  name: 'ansiColors'
})
export class AnsiColorPipe implements PipeTransform {

  static readonly Styles = `
    :host /deep/ .log-message-30m {
      color: rgb(0, 0, 0)
    }
  

    :host /deep/ .log-message-31m {
      color: rgb(170, 0, 0)
    }
  

    :host /deep/ .log-message-32m {
      color: rgb(0, 170, 0)
    }
  

    :host /deep/ .log-message-33m {
      color: rgb(170, 85, 0)
    }
  

    :host /deep/ .log-message-34m {
      color: rgb(0, 0, 170)
    }
  

    :host /deep/ .log-message-35m {
      color: rgb(170, 0, 170)
    }
  

    :host /deep/ .log-message-36m {
      color: rgb(0, 170, 170)
    }
  

    :host /deep/ .log-message-37m {
      color: rgb(170, 170, 170)
    }
  `;

  constructor() {
  }

  transform(message: string, ...args: any[]): string {

    const parts = message.split(ansiRegEx()).reverse();
    const tokens = Array.from(message.match(ansiRegEx()) || []).reverse();

    return parts.map((p, i) => {
      const token = tokens[i];
      if (token) {
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
