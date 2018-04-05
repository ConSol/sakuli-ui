import {Type} from "@angular/compiler/src/core";
import {environment} from "../../environments/environment";

export const uniq = <T>(array: T[], idFactory: (e: T) => string) => {
  return Array.from(
    array
      .reduce((m, e) => {
        const id = idFactory(e);
        if (!m.has(id)) {
          m.set(id, e);
        }
        return m;
      }, new Map())
      .values()
  );
};

export function nothrowFn<P1, R>(cb: (p1: P1) => R, defaultValue?: R): (p1: P1) => R;
export function nothrowFn<P1, P2, R>(cb: (p1: P1, p2: P2) => R,  defaultValue?: R): (p1: P1, p2: P2) => R;
export function nothrowFn<P1, P2, P3, R>(cb: (p1: P1, p2: P2, p3: P3) => R,  defaultValue?: R): (p1: P1, p2: P2, p3: P3) => R;
export function nothrowFn(cb: (...args: any[]) => any,  defaultValue: any = undefined): (...args: any[]) => any {
  return (function (...args: any[]) {
    try {
      return cb(...args);
    } catch (e) {
      return defaultValue;
    }
  })
}

export const urlencoded = (s: TemplateStringsArray, ...v:any[]) => {
  let result = '';
  for(let i = 0; i < Math.max(s.length, v.length); i++) {
    const literal = s[i] || '';
    const variable = v[i] || '';
    result += literal;
    result += encodeURIComponent(variable);
  }
  return result;
};


export class Logger {
  private env = environment;
  constructor(readonly context: Type) {

  }

  log(message: string, ...more: any[]) {
    console.log(this.getMessage(message), ...more);
  }

  warn(message: string, ...more: any[]) {
    console.log(this.getMessage(message), ...more);
  }

  debug(message: string, ...more: any[]) {
    if('debug' in console) {
      console.debug(this.getMessage(message), ...more);
    }
  }

  trace(message: string, ...more: any[]) {
    if('trace' in console) {
      console.trace(this.getMessage(message), ...more);
    }
  }

  group(message: string, ...more: any[]) {
    if('group' in console) {
      console.group(this.getMessage(message), ...more);
    }
  }

  groupEnd() {
    if('groupEnd' in console) {
      console.groupEnd();
    }
  }

  private getMessage(message: string) {
    return `${this.context.name}:${message}`
  }
}
