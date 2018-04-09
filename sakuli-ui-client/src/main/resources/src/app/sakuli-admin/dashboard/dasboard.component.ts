import {TestSuiteResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";
import {DateUtil} from "../../sweetest-components/utils";
import {resultStateMap} from "../test/report/result-state-map.const";
import * as moment from "moment";
import {NavigateToResultReport} from "../test/report/sa-report.actions";
import {Store} from "@ngrx/store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-dashboard',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-cube"
        title="Dashboard"
      >
        <sc-icon
          class="cursor-pointer"
          icon="fa-refresh"
          (click)="refresh.next()"
        ></sc-icon>
      </sc-heading>
      <article class="d-flex flex-column">
        <sc-loading displayAs="progressbar" for="loadingTestResults" #loading></sc-loading>
        <ng-container *ngIf="!(loading.show$ | async)">
          <ng-container *ngFor="let testSuite of testSuites">
            <sa-report-navigation
              [testResult]="first(getResultsForSuite(testSuite))"
              [navigation]="false"
            ></sa-report-navigation>
            <div class="shade mb-3 p-0">
              <div>
                <testsuite-stats-component
                  class="m-3 d-flex"
                  [results]="getResultsForSuite(testSuite)"
                  *ngIf="!isTableView(testSuite)"
                >
                </testsuite-stats-component>
                <sc-result-table
                  *ngIf="isTableView(testSuite)"
                  [results]="getResultsForSuite(testSuite)"
                  (selectResult)="navigateToResult($event)"
                >
                </sc-result-table>
              </div>
              <div
                class="p-3 footer d-flex flex-row justify-content-end border border-primary border-left-0 border-right-0 border-bottom-0">
                <button *ngIf="!isTableView(testSuite)" class="btn-link border-0" (click)="toggleTableView(testSuite)">
                  <sc-icon icon="fa-table">Tableview</sc-icon>
                </button>
                <button *ngIf="isTableView(testSuite)" class="btn-link border-0" (click)="toggleTableView(testSuite)">
                  <sc-icon icon="fa-line-chart">Statistics</sc-icon>
                </button>
              </div>
            </div>
          </ng-container>
        </ng-container>
      </article>
    </sc-content>
  `
})
export class DashboardComponent {

  @Input() testSuites: SakuliTestSuite[];
  @Input() testResults: TestSuiteResult[];

  @Output() refresh = new EventEmitter<void>();

  tableViewMap = new Map<string, boolean>();

  constructor(
    readonly store: Store<any>
  ) {}

  first<T>(array: T[], defaultValue?: T): T {
    return array[0] || defaultValue;
  }

  toggleTableView(testSuite: SakuliTestSuite) {
    this.tableViewMap.set(testSuite.id, !this.tableViewMap.get(testSuite.id));
  }

  isTableView(testSuite: SakuliTestSuite) {
    return !!this.tableViewMap.get(testSuite.id);
  }

  getResultsForSuite(testSuite: SakuliTestSuite) {
    return this.testResults.filter(tr => {
      return (tr.id || '').endsWith(testSuite.id)
    })
      .sort((a,b) => moment(b.startDate).diff(moment(a.startDate)))
  }

  duration(start:string, stop:string) {
    return DateUtil.diff(stop, start) / 1000;
  }

  badgeClass(state: string) {
    return `badge-${resultStateMap[state]}`;
  }

  navigateToResult(result: TestSuiteResult) {
    this.store.dispatch(new NavigateToResultReport(result))
  }
}

