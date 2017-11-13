import * as moment from 'moment';
import {Moment} from "moment";

export const splitFilter = <T>(predicate: (i:T)=> boolean ,a: T[]) => {
  return [a.filter(predicate), a.filter(i => !predicate(i))];
};

export class BoundIndexIterator {
  private _current;
  constructor(
    readonly length,
    readonly init = 0
  ) {
    this._current = init;
  }

  get current() {
    return this._current;
  }

  next() {
    if(this._current < this.length -1) {
      this._current++;
    } else {
      this._current = 0;
    }
    return this.current;
  }

  prev() {
    if(this._current > 0) {
      this._current--;
    } else {
      this._current = this.length - 1;
    }
    return this.current;
  }
}

export function ansiRegEx() {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
  ].join('|');

  return new RegExp(pattern, 'g');
}


export class DateUtil {

  static set locale(locale: string) {
    moment.locale("de");
  }

  static get locale() {
    return moment.locale();
  }

  static Formats = {
    "default": "MMM D, YYYY H:mm:ss a"
  };

  static createMoment(dateStr: string): Moment {
    const woFormat = moment(dateStr);
    if(moment(dateStr).isValid()) {
      return woFormat;
    }
    for(let k of Object.keys(DateUtil.Formats)) {
      const m = moment(dateStr, DateUtil.Formats[k]);
      if(m.isValid()) {
        return m;
      }
    }
    return moment.invalid();
  }

  static createComparator<T>(pick: (e:T)=> string, format: string) {
      return (e1: T, e2: T) => {
        return DateUtil.diff(pick(e2), pick(e1));
      }
  }

  /**
   * Calculates the diffenrence between t1 - t2
   * @param {string} t1
   * @param {string} t2
   * @returns {number}
   */
  static diff(t1: string, t2: string) {
    const m1 = DateUtil.createMoment(t1);
    const m2 = DateUtil.createMoment(t2);
    return m1.diff(m2);
  }
}

export class Deferred<T> {

  private _promise: Promise<T>;
  private _resolve: (value: T) => void;
  private _reject: (reason: any) => void;

  constructor() {
    this._promise = new Promise((res, rej) => {
      this._resolve = res;
      this._reject = rej;
    })
  }

  resolve(value: T) {
    this._resolve(value);
  }

  reject(reason: any) {
    this._reject(reason);
  }

  get promise() {
    return this._promise;
  }

  async getValue(): Promise<T> {
    return new Promise<T>((res, rej) => {
      this.promise.then(res, rej);
    })
  }

}

class Counter {
  constructor(
    private _value: number
  ) {}

  get value() {
    return this._value;
  }

  dec() {
    return this._value--;
  }

  inc() {
    return this._value++
  }
}

const _ids = new Map<string,Counter>();
export function* idGenerator(prefix: string, init = 0) {
  if(!_ids.has(prefix)) {
    _ids.set(prefix, new Counter(init));
  }
  while(true) {
    yield `${prefix}-${_ids.get(prefix).inc()}`;
  }
}
