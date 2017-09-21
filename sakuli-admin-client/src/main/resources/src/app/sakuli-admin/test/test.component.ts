import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TestCase, TestSuite} from '../../sweetest-components/services/access/model/test-suite.model';
import {
  SakuliTestCase, SakuliTestSuite
} from '../../sweetest-components/services/access/model/sakuli-test-model';
import {TestRunInfo} from "../../sweetest-components/services/access/model/test-run-info.interface";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";

@Component({
  selector: 'sa-project-open',
  template: `
    <sc-content>
      <sc-heading
        [title]="title$ | async"
        [subTitle]="(subTitle$ | async)"
        icon="fa-cubes"
      ></sc-heading>
      <article class="no-gutter">
        <run-test-suite [testSuite]="testSuite$ | async"></run-test-suite>
        <div *ngIf="testRunInfo$ | async">
        </div>
        <div class="margin-y">
          <input class="form-control" [ngbTypeahead]="search" [resultFormatter]="formatter">
        </div>
        <sc-table>
          <thead>
          <tr>
            <th></th>
            <th>Testcase</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let testCase of testCases$|async">
            <td>

            </td>
            <td>
              <a [routerLink]="['/test', 'sources', testCase.name]">{{testCase.name}}</a>
            </td>
            <td></td>
          </tr>
          </tbody>
        </sc-table>
      </article>
    </sc-content>
  `,
  styles: [`
  `]
})
export class TestComponent {

  testSuite$: Observable<SakuliTestSuite>;
  testRunInfo$: Observable<TestRunInfo>;
  subTitle$: Observable<string>;
  title$: Observable<string>;
  testCases$: Observable<SakuliTestCase[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.testSuite$ = this.store.select(s => s.test.testSuite as SakuliTestSuite);
    this.title$ = this.testSuite$.map(ts => ts ? ts.configuration.id : '');
    this.subTitle$ = this.testSuite$.map(ts => ts ? ts.configuration.name : '');
    this.testCases$ = this.testSuite$.map(ts => ts.testCases);
    this.testRunInfo$ = this.store.select(s => s.test.testRunInfo);

  }

  search = (text$: Observable<string>) => text$
    .debounceTime(200)
    .mergeMap(term => this
      .testSuite$
      .map(ts => ts.testCases)
      .map(tc => tc.filter(c => c.name.indexOf(term)))
    );

  formatter = (tc: TestCase) => tc.name;


}
