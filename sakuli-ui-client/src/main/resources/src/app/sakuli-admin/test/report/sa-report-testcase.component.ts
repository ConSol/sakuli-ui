import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {
  TestCaseResult,
  TestCaseStepResult
} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DateUtil} from "../../../sweetest-components/utils";
import {rmHeadSlashAndEncode} from "../../../sweetest-components/services/access/file.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-report-testcase',
  template: `
    <ul class="list-group list-group-flush">
      <ng-template #exceptionTemplate>
        <li class="list-group-item d-flex flex-column">
          <strong>{{testCase.exception.detailMessage}}</strong>
          <thumbnail-component
            [src]="'api/files?path=' + testSuitePath + '/_logs/_json/' + rmHeadSlashAndEncode(testCase.exception.screenshot)"
            width="250px"
          ></thumbnail-component>
          <div>
            <button class="btn btn-link" (click)="showStacktrace = !showStacktrace">Show Stacktrace</button>
            <!--TODO tnobody missing import, see sa-report-steps.component-->
            <button class="btn btn-link"
                    *ngIf="showStacktrace"
                    (click)="toClipBoard(stackTraceArea)">Copy stack trace to clipboard
            </button>
          </div>
          <textarea #stackTraceArea
                    [disabled]="true"
                    rows="20"
                    [hidden]="!showStacktrace"
          >{{testCase.exception.stackTrace}}</textarea>
        </li>
      </ng-template>
      <ng-container *ngIf="!testCase.exception; else exceptionTemplate">
        <sa-report-steps
          *ngFor="let step of testCase.steps; let i = index"
          [testSuitePath]="testSuitePath"
          [step]="step"
          [durationPercent]="durations[i] / testCaseDuration"
          [durationOffsetPercent]="durationOffsets[i] / testCaseDuration"
        ></sa-report-steps>
      </ng-container>
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

  rmHeadSlashAndEncode = rmHeadSlashAndEncode;

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
