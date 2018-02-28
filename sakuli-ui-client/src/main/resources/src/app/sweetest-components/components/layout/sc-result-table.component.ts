import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestSuiteResult} from "../../services/access/model/test-result.interface";
import {resultStateMap} from "../../../sakuli-admin/test/report/result-state-map.const";
import {DateUtil} from "../../utils";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-result-table',
  template: `
    <table class="table table-hover table-striped">
      <tr>
        <th>State</th>
        <th>Suite</th>
        <th>Started</th>
        <th>Duration (s)</th>
      </tr>
      <tr *ngFor="let result of results" (click)="selectResult.next(result)">
        <td>
          <span class="badge" [ngClass]="badgeClass(result.state)">{{result.state}}</span>
        </td>
        <td>{{result.id}}</td>
        <td>{{result.startDate|moment:'DD.MM.YYYY hh:mm'}}</td>
        <td>{{duration(result.startDate, result.stopDate)}}</td>
      </tr>
    </table>
  `
})

export class ScResultTableComponent implements OnInit {

  @Input() results: TestSuiteResult;
  @Output() selectResult = new EventEmitter<TestSuiteResult>();

  constructor() {
  }

  ngOnInit() {

  }

  duration(start:string, stop:string) {
    return DateUtil.diff(stop, start) / 1000;
  }

  badgeClass(state: string) {
    return `badge-${resultStateMap[state]}`;
  }
}
