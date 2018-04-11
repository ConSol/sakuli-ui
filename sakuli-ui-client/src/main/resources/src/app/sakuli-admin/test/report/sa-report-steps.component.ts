import {Component, Input, OnInit} from '@angular/core';
import {TestCaseStepResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {resultStateMap} from "./result-state-map.const";

@Component({
  selector: 'sa-report-steps',
  template: `
    <ng-container>
      <li class="list-group-item pointer-cursor d-flex flex-row" (click)="toggleCollapse()">
        <sc-icon [icon]="step?.testActions?.length || step?.exception ? 'fa-caret-right' : ''" [fixedWidth]="true"
                 [rotate]="collapsed ? 90 : 0"></sc-icon>
        <ng-container *ngIf="step.exception">
          <sc-icon iconClass="text-danger" icon="fa-exclamation-triangle"></sc-icon>
        </ng-container>
        <strong>{{step.name}}</strong>
        <ng-template #noException>
          <span class=" pl-1">{{step.testActions?.length}} actions </span>
          <span class="text-muted  pl-1" *ngIf="step.stopDate">
            <sc-icon icon="fa-clock-o"></sc-icon>
            {{((step.stopDate | dateDiff:step.startDate) / 1000) | number}} sec
          </span>
          <span class="m-1 badge badge-warning" *ngIf="step.state === 'WARNING'">
            Warningtime of <strong>{{step.warningTime}}</strong> sec exceeded
          </span>
        </ng-template>
        <ng-container *ngIf="step.exception; else noException">
          <div class="exception-title text-danger pl-1">{{step.exception.detailMessage}}</div>
        </ng-container>
      </li>
      <li class="list-group-item m-0 p-0 border-0 d-flex flex-row bg-light"
          style="height: 3px; background-color: silver">
        <div [ngStyle]="{'flex-grow': durationOffsetPercent}"></div>
        <div [ngStyle]="{'flex-grow': durationPercent}" class="bg-success"></div>
      </li>
      <sc-collapse [show]="collapsed">
        <sa-report-exception [exception]="step.exception" [testSuitePath]="testSuitePath"></sa-report-exception>
        <sa-action *ngFor="let action of step.testActions" [action]="action"></sa-action>
      </sc-collapse>
    </ng-container>
  `,
  styles: [`
    .list-group-item {
      word-wrap: break-word;
    }

    pre {
      background-color: #EEEEEE;
      font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
      margin-bottom: 10px;
      max-height: 600px;
      overflow: auto;
      padding: 5px;
      width: auto;
    }

    .exception-title {
      flex-grow: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    textarea {
      border: 0;
    }
  `]
})

export class SaReportStepsComponent implements OnInit {

  @Input() step: TestCaseStepResult;
  @Input() testSuitePath: string;
  @Input() durationPercent: number;
  @Input() durationOffsetPercent: number;

  collapsed = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  constructor() {
  }

  ngOnInit() {
  }

  backgroundState(state: string) {
    console.log(state);

    return state === 'OK' ? 'bg-default' : `bg-${resultStateMap[state]}`;
  }
}
