import {Pipe, PipeTransform} from '@angular/core';
import {DateUtil} from "../../utils";
import * as moment from "moment";

@Pipe({
  name: 'dateDiff'
})
export class DateDiffPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    const [v2] = args;
    return DateUtil.diff(value, v2);
  }
}

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const [format = ''] = args;
    return DateUtil.createMoment(value).format(format);
  }
}
