import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {
  TestCaseResult,
  TestSuiteResult
} from "../../../sweetest-components/services/access/model/test-result.interface";

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
              <span class="badge badge-danger" *ngIf="testCase.state === 'CRITICAL'">
                Criticaltime of <strong>{{testCase.criticalTime}}</strong> sec exceeded
              </span>
              <span class="badge badge-warning" *ngIf="testCase.state === 'WARNING'">
                Warningtime of <strong>{{testCase.warningTime}}</strong> sec exceeded
              </span>
            </small>
          </h4>
        </div>
        <sa-report-testcase
          [testCase]="testCase"
        ></sa-report-testcase>
      </div>
    </ng-container>
  `
})
export class SaReportContentComponent implements OnInit {

  @Input() testResult: TestSuiteResult;

  ngOnInit() {

  }

  get testCases(): TestCaseResult[] {
    return Object.keys(this.testResult.testCases).reduce((l, k) => [...l, this.testResult.testCases[k]], []);
  }


}
