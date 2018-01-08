import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {LoadTestResults} from "../state/test.actions";
import {AppState} from "../../appstate.interface";
import {testSelectors} from "../state/test.interface";
import {Observable} from "rxjs/Observable";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {NavigateToResultReport} from "./sa-report.actions";

@Component({
  selector: 'sa-report-overview',
  template: `
    <sc-content
    >
      <article>
        <sc-result-table
          (selectResult)="navigateToResult($event)"
          [results]="results$ | async"
        ></sc-result-table>
      </article>
    </sc-content>
  `
})

export class SaReportOverviewComponent implements OnInit {
  private results$: Observable<TestSuiteResult[]>;

  constructor(readonly store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new LoadTestResults());
    this.results$ = this.store.select(testSelectors.testResults)
  }

  navigateToResult(result: TestSuiteResult) {
    this.store.dispatch(new NavigateToResultReport(result))
  }
}
