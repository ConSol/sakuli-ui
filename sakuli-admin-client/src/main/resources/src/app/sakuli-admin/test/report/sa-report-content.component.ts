import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {
  TestCaseResult,
  TestSuiteResult
} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DateUtil} from "../../../sweetest-components/utils";
import {colors} from "./result-state-map.const";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-report-content',
  template: `
    <ng-container *ngIf="testResult">
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
        <div class="card-block d-flex flex-row align-items-end"
             style="height: 30px">
          <sa-report-steps-timing
            *ngFor="let timing of timingsFor(testCase); let i = index"
            [color]="getColor(i)"
            [timing]=" timing.duration / (testCase.stopDate|dateDiff:testCase.startDate)"
            ngbTooltip="Test"
            container="body"
          >
          </sa-report-steps-timing>
        </div>
        <ul class="list-group list-group-flush">
          <sa-report-steps
            *ngFor="let step of testCase.steps"
            [step]="step"
          ></sa-report-steps>
          <sa-action *ngFor="let action of testCase.testActions" [action]="action">
          </sa-action>
        </ul>
      </div>
    </ng-container>
  `
})

export class SaReportContentComponent implements OnInit {

  log(m: string, e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    console.log(m);
  }

  @Input() testResult: TestSuiteResult;

  constructor(readonly renderer: Renderer2) {
  }

  ngOnInit() {
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

  getColor(i: number) {
    return colors[i % (colors.length)]
  }

}
