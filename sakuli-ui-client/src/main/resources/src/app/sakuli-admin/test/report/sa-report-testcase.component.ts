import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {
  TestCaseResult,
  TestCaseStepResult
} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DateUtil} from "../../../sweetest-components/utils";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-report-testcase',
  template: `
    <ul class="list-group list-group-flush">
      <sa-report-exception [exception]="testCase.exception" [testSuitePath]="testSuitePath"></sa-report-exception>
      <sa-report-steps
        *ngFor="let step of testCase.steps; let i = index"
        [testSuitePath]="testSuitePath"
        [step]="step"
        [durationPercent]="durations[i] / testCaseDuration"
        [durationOffsetPercent]="durationOffsets[i] / testCaseDuration"
      ></sa-report-steps>
      <sa-report-steps
        [testSuitePath]="testSuitePath"
        [step]="pseudoStep"
        [durationPercent]="pseudoDuration / testCaseDuration"
        [durationOffsetPercent]="pseudoDurationOffset / testCaseDuration"
      ></sa-report-steps>
    </ul>
  `,
  styles: [`
    .exception-title {
      flex-grow: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  `]
})
export class SaReportTestcaseComponent implements OnInit {

  collapsed = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  @Input() testCase: TestCaseResult;
  @Input() testSuitePath: string;

  pseudoDurationOffset: any;
  pseudoDuration: number;
  durationOffsets: number[] = [0];
  durations: number[] = [];
  pseudoStep: TestCaseStepResult;

  get testCaseDuration() {
    return DateUtil.diff(this.testCase.stopDate, this.testCase.startDate);
  }


  constructor() {
  }

  createPseudoStep() {
    const lastCase = [...this.testCase.steps].pop();
    this.pseudoStep = {
      startDate: lastCase ? lastCase.stopDate : this.testCase.startDate,
      stopDate: this.testCase.stopDate,
      testActions: this.testCase.testActions,
      name: `Final steps`,
      exception: null,
      state: 'OK',
      resultCode: this.testCase.resultCode,
      dbPrimaryKey: this.testCase.dbPrimaryKey,
      id: ``,
      criticalTime: this.testCase.criticalTime,
      warningTime: this.testCase.warningTime,
    };
  }

  ngOnInit() {
    this.createPseudoStep();
    const sum = (a, b) => a + b;
    for (const step of this.testCase.steps) {
      const duration = DateUtil.diff(step.stopDate, step.startDate);
      const durationOffset = this.durations.reduce(sum, 0) + duration;
      this.durations.push(duration);
      this.durationOffsets.push(durationOffset);
    }
    this.pseudoDuration = DateUtil.diff(this.pseudoStep.stopDate, this.pseudoStep.startDate);
    this.pseudoDurationOffset = this.durations.reduce(sum, 0) + this.pseudoDuration;
  }
}
