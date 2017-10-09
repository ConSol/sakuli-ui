import {DashboardService} from "./dashboard.service";
import {TestCaseResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {Component, Input, OnInit} from "@angular/core";
import {TestService} from "../../sweetest-components/services/access/test.service";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {LoadTestResults} from "../test/state/test.actions";
import * as moment from "moment";
import 'moment/locale/de';
import {DateUtil} from "../../sweetest-components/utils";
import {notNull} from "../../core/redux.util";

@Component({
  selector: 'sc-dashboard',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-cube"
        title="Dashboard"
      ></sc-heading>
      <article class="d-flex flex-column">
        <sc-loading displayAs="progressbar" for="loadingTestResults" #loading></sc-loading>
        <ng-container *ngIf="!(loading.show$ | async)">
          <div class="test-case-stats" *ngFor="let case of latestTestCases$ | async">
            <sc-hx [order]="3">
              {{case.name}}
              <small class="text-muted">{{case.startTime | date}}</small>
            </sc-hx>
            <div class="d-flex">
              <sc-circle-indicator class="col-md-4" [value]="stepsTotal(case)" state="success">
                <div class="text">Steps Total</div>
              </sc-circle-indicator>
              <sc-circle-indicator class="col-md-4" [value]="stepsFailed(case)" state="danger">
                <div class="text">Steps Failed</div>
              </sc-circle-indicator>
              <sc-circle-indicator class="col-md-4" [value]="stepErrors(case)" state="warning">
                <div class="text">Steps Error</div>
              </sc-circle-indicator>
            </div>
          </div>
          <sc-table>
            <tr>
              <th>State</th>
              <th>Name</th>
              <th>Started</th>
              <th>Duration</th>
            </tr>
            <tr *ngFor="let result of dashboard.testResults | async"
            >
              <td>
                <span class="badge" [ngClass]="{
                'badge-danger': result.state === 'ERRORS',
                'badge-warning': result.state === 'WARNING_IN_STEP'
              }">{{result.state}}</span>
              </td>
              <td>{{result.id}}</td>
              <td>{{moment(result.startDate, format).toDate() | date:'y-MM-dd HH:mm:ss'}}</td>
              <td>{{moment(result.stopDate, format).diff(moment(result.startDate, format)) | date:'mm:ss'}}</td>
            </tr>
          </sc-table>
        </ng-container>
      </article>
    </sc-content>
  `,
  styles: [`
    .test-case-stats {
      margin-bottom: 15px;
    }

    .text {
      font-weight: bold;
    }
  `]
})
export class DashboardComponent implements OnInit {

  constructor(private testService: TestService,
              readonly dashboard: DashboardService,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new LoadTestResults());
  }

  stepsTotal(caseResult: TestCaseResult) {
    return caseResult.steps.length;
  }

  stepErrors(caseResult: TestCaseResult) {
    return caseResult.steps.filter(s => s.state === 'ERRORS').length
  }

  stepsFailed(caseResult: TestCaseResult) {
    return caseResult.steps.filter(s => s.state === 'FAILED').length
  }

  get latestTestCases$() {
    return this.dashboard.latest$
      .filter(notNull)
      .distinctUntilChanged()
      .map(tsr => Object.keys(tsr.testCases).reduce((l, k) => [...l, tsr.testCases[k]], []))
  }

  private moment(date: string, format?: string) {
    return DateUtil.createMoment(date);
  };

  private format = DateUtil.Formats.default;

}

