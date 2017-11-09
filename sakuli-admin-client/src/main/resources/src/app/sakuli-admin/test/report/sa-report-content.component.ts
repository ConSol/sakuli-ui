import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {
  TestCaseResult,
  TestSuiteResult
} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DateUtil} from "../../../sweetest-components/utils";
import {colors} from "./result-state-map.const";
import {scan} from "ramda";

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
