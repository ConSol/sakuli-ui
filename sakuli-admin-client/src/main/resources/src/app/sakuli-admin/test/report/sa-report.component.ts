import {Component, OnInit} from '@angular/core';
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {testResults} from "../state/test.interface";
import {LoadTestResults} from "../state/test.actions";
import {BoundIndexIterator} from "../../../sweetest-components/utils";

@Component({
  selector: 'sa-report',
  template: `
    <sc-content>
      <!--
      <sc-heading
        icon="fa-tasks"
        title="Reports"
      ></sc-heading>
      -->
      <article class="d-flex flex-column">
        <sc-loading displayAs="progressbar" for="loadingTestResults"></sc-loading>
        <sa-report-navigation [testResult]="currentResult$ | async"
                              (next)="next()"
                              (prev)="prev()"
        ></sa-report-navigation>
        <sa-report-content
          [testResult]="currentResult$ | async"
        ></sa-report-content>
      </article>
    </sc-content>
  `
})
export class SaReportComponent implements OnInit {

  indexIterator: BoundIndexIterator = new BoundIndexIterator(0, 0);

  index = 0;

  constructor(private store: Store<AppState>) {
  }

  prev() {
    this.indexIterator.prev();
  }

  next() {
    this.indexIterator.next();
  }

  get testResults$() {
    return this.store.select(testResults);
  }

  get currentResult$() {
    return this.testResults$.map(trs => trs[this.indexIterator.current]);
  }

  ngOnInit() {
    const [withEntries, withoutEntries] = this.testResults$.partition(tr => !!tr.length);
    withEntries
      .first()
      .subscribe(tr => this.indexIterator = new BoundIndexIterator(tr.length, this.index));

    withoutEntries
      .first()
      .subscribe(tr => this.store.dispatch(new LoadTestResults()));
  }

}
