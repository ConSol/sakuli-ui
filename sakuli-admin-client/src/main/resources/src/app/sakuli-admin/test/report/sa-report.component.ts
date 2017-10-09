import {Component, OnInit} from '@angular/core';
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {testResults} from "../state/test.interface";
import {LoadTestResults} from "../state/test.actions";

@Component({
  selector: 'sa-report',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-tasks"
        title="Reports"
      ></sc-heading>
      <article class="d-flex flex-column">
        <sc-loading displayAs="progressbar" for="loadingTestResults"></sc-loading>
        <sa-report-navigation [testResult]="currentResult$ | async"
          (next)="next()"
          (prev)="prev()"
        ></sa-report-navigation>
        <sa-report-content [testResult]="currentResult$ | async"
        ></sa-report-content>
      </article>
    </sc-content>
  `
})
export class SaReportComponent implements OnInit {

  index = 0;

  constructor(private store: Store<AppState>) {
  }

  prev() {
    this.index--;
  }

  next() {
    this.index++;
  }

  get testResults$() {
    return this.store.select(testResults);
  }

  get currentResult$() {
    return this.testResults$.map(trs => trs[this.index]);
  }

  ngOnInit() {
    this.testResults$.first().subscribe(tr => {
      if (!tr.length) {
        this.store.dispatch(new LoadTestResults());
      }
    })
  }
}
