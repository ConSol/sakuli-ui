import {Component, OnInit} from '@angular/core';
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {LoadTestResults} from "../test/state/test.actions";
import {testSuiteSelectors} from "../test/state/testsuite.state";
import {testSelectors} from "../test/state/test.interface";
import {log} from "../../core/redux.util";

@Component({
  selector: 'dashboard-connected-component',
  template: `
    <sc-dashboard
      [testSuites]="testSuites$ | async"
      [testResults]="testResults$ | async"
      (refresh)="refresh()"
    ></sc-dashboard>
  `
})
export class DashboardConnectedComponent implements OnInit {
  constructor(
    readonly store: Store<AppState>
  ) {
  }

  testSuites$ = this.store.select(testSuiteSelectors.selectAll);
  testResults$ = this.store
    .select(testSelectors.testResults)
    .do(log('REsults'))
  ;

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.store.dispatch(new LoadTestResults());
  }
}
