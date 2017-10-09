import * as moment from 'moment';
import {Moment} from "moment";

export type Constructor<T = {}> = new (...args: any[]) => T;

function Mixin<MBase extends Constructor>(Base: MBase) {
  return class extends Base {
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

  static diff(t1: string, t2: string) {
    const m1 = DateUtil.createMoment(t1);
    const m2 = DateUtil.createMoment(t2);
    return m1.diff(m2);
  }
}
