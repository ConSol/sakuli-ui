import {DashboardService} from "./dashboard.service";
import {TestCaseResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {Component, Input, OnInit} from "@angular/core";
import {TestService} from "../../sweetest-components/services/access/test.service";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {LoadTestResults} from "../test/state/test.actions";

@Component({
  selector: 'sc-dashboard',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-cube"
        title="Dashboard"
      ></sc-heading>
      <article class="d-flex flex-column">
        <div class="test-case-stats" *ngFor="let case of (dashboard.latest$ | async)?.testCaseResults">
          <sc-hx [order]="3">
            {{case.name}}
            <small class="text-muted">{{case.startTime|date}}</small>
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
            <th>Started</th>
            <th>Duration</th>
          </tr>
          <tr *ngFor="let result of dashboard.testResults | async"
          >
            <td>
              <span class="badge" [ngClass]="{
                'badge-danger': result.resultState === 'ERRORS',
                'badge-warning': result.resultState === 'WARNING_IN_STEP'
              }">{{result.resultState}}</span>
            </td>
            <td>{{result.startTime | date:'y-MM-dd HH:mm:ss'}}</td>
            <td>{{result.endTime - result.startTime | date:'mm:ss'}}</td>
          </tr>
        </sc-table>
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

  constructor(
    private testService: TestService,
    readonly dashboard: DashboardService,
    private store: Store<AppState>
  ){}

  ngOnInit() {
      this.store.dispatch(new LoadTestResults());
  }

  stepsTotal(caseResult: TestCaseResult) {
      return caseResult.stepResults.length;
  }

  stepErrors(caseResult: TestCaseResult) {
      return caseResult.stepResults.filter(s => s.resultState === 'ERRORS').length
  }

  stepsFailed(caseResult: TestCaseResult) {
    return caseResult.stepResults.filter(s => s.resultState === 'FAILED').length
  }

}

