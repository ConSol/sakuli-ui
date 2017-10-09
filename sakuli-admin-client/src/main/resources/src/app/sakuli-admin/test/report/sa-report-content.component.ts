import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {
  TestCaseResult,
  TestSuiteResult
} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DateUtil} from "../../../sweetest-components/utils";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-report-content',
  template: `
    <ng-container *ngIf="testResult">
      <my-test-component [testCase]="testResult"></my-test-component>
      <div class="card mt-3" *ngFor="let testCase of testCases">
        <div class="card-body">
          <h4 class="card-title">{{testCase.name}}
            <small class="text-muted">
              <sc-icon icon="fa-clock-o">
                {{((testCase.stopDate | dateDiff:testCase.startDate) / 1000) | number}} sec
              </sc-icon>
            </small>
          </h4>
        </div>
        <div class="car-block d-flex flex-row align-items-end" style="height: 30px">
          <div
            *ngFor="let timing of timingsFor(testCase); let i = index"
            ngbTooltip="'timing.step?.name'"
            container="body"
            #timingBox
            (mouseover)="grow(timingBox)"
            (mouseout)="shrink(timingBox)"
            [ngStyle]="{
              'flex-grow': (testCase.stopDate|dateDiff:testCase.startDate) / timing.duration ,
              'background-color': getColor(i) 
            }"
            style="height: 20px"
            class="d-block"
          >&nbsp;
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <ng-container *ngFor="let step of testCase.steps">
            <li class="list-group-item pointer-cursor" (click)="collapse.toggle()">
              <sc-icon icon="fa-caret-right"></sc-icon>
              <strong>{{step.name}}</strong>
            </li>
            <sc-collapse #collapse [show]="false">
              <sa-action *ngFor="let action of step.testActions" [action]="action"></sa-action>
            </sc-collapse>
          </ng-container>
          <li class="list-group-item pointer-cursor" (click)="collapse.toggle()">
            <sc-icon icon="fa-caret-right"></sc-icon>
            <strong>Actions without step</strong>
          </li>
          <sc-collapse #collapse [show]="false">
            <sa-action *ngFor="let action of testCase.testActions" [action]="action">
            </sa-action>
          </sc-collapse>
        </ul>
      </div>
    </ng-container>
  `
})

export class SaReportContentComponent implements OnInit {

  static colors = [
    'blue', 'red', 'yellow', 'green'
  ];

  @Input() testResult: TestSuiteResult;

  constructor(readonly renderer: Renderer2) {
  }

  ngOnInit() {
  }

  getColor(i: number) {
    const {colors} = SaReportContentComponent;
    return colors[i % (colors.length)]
  }

  get testCases(): TestCaseResult[] {
    return Object.keys(this.testResult.testCases).reduce((l, k) => [...l, this.testResult.testCases[k]], []);
  }

  get timings() {
    return this.testCases.map(tc => tc.duration);
  }

  timingsFor(testCase: TestCaseResult) {
    const timings = testCase.steps.map(step => ({
      step,
      duration: DateUtil.diff(step.stopDate, step.startDate)
    }));
    const timingsSum = timings.reduce((s, t) => s + t.duration, 0);
    return [...timings, {
      duration: DateUtil.diff(testCase.stopDate, testCase.startDate) - timingsSum
    }];
  }
}
