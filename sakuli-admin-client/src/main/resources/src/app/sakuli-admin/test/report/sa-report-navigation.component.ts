import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {resultStateMap} from "./result-state-map.const";

@Component({
  selector: 'sa-report-navigation',
  template: `
    <div [class]="cardClass" *ngIf="testResult">
      <div [class]="'d-flex flex-row justify-content-between align-items-center ' + stateClass">
        <button class="btn btn-link" (click)="prev.next()">
          <sc-icon icon="fa-chevron-left"></sc-icon>
        </button>
        <div style="flex-grow: 1" class="text-center">
          <sc-icon icon="fa-calendar">
            {{testResult.startDate | date:'dd-MM-y hh:mm:ss'}}
          </sc-icon> |
          <span><sc-icon icon="fa-clock-o">
            {{((testResult.stopDate|dateDiff:testResult.startDate) / 1000)|number}} sec
          </sc-icon></span> |
          {{testResult.id}} 
        </div>
        <button class="btn btn-link" (click)="next.next()">
          <sc-icon icon="fa-chevron-right"></sc-icon>
        </button>
      </div>
      <div class="card-body">
        {{testResult.state}}
      </div>
    </div>
  `
})

export class SaReportNavigationComponent implements OnInit {

  @Input() testResult: TestSuiteResult;

  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();

  get stateClass() {
    const {state = ''} = this.testResult;
    return resultStateMap[state] || '';
  }

  get cardClass() {
    return `card d-block`;
  }

  constructor() {
  }

  ngOnInit() {
  }


}
