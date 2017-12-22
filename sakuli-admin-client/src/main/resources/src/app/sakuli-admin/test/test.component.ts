import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
  SakuliTestCase, SakuliTestSuite
} from '../../sweetest-components/services/access/model/sakuli-test-model';
import {TestRunInfo} from "../../sweetest-components/services/access/model/test-run-info.interface";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {ProjectModel} from "../../sweetest-components/services/access/model/project.model";
import {log, notNull} from "../../core/redux.util";
import {LoadTestsuite, testSuiteSelectors} from "./state/testsuite.state";
import {ActivatedRoute} from "@angular/router";
import {RunTestSuiteComponent} from "./run-test-suite.component";
import {TestExecutionEntity, testExecutionSelectors} from "./state/testexecution.state";

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
        <run-test-suite 
          [testSuite]="testSuite$ | async"
          #runTestSuiteComponent
        ></run-test-suite>
      </article>
    </sc-content>
  `,
  styles: [`
  `]
})
export class TestComponent implements OnInit {

  @ViewChild(RunTestSuiteComponent)
  runTestSuiteComponent: RunTestSuiteComponent;

  testSuite$: Observable<SakuliTestSuite>;
  testRunInfo$: Observable<TestExecutionEntity>;
  subTitle$: Observable<string>;
  title$: Observable<string>;
  testCases$: Observable<SakuliTestCase[]>;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {
    this.testSuite$ = this.activatedRoute.params
      .map(p => p['suite']).filter(notNull)
      .mergeMap(id => this.store.select(testSuiteSelectors.byId(decodeURIComponent(id))))
    this.title$ = this.testSuite$.map(ts => ts ? ts.configuration.id : '');
    this.subTitle$ = this.testSuite$.map(ts => ts ? ts.configuration.name : '');
    this.testCases$ = this.testSuite$.map(ts => ts.testCases);
    this.testRunInfo$ = this.testSuite$.mergeMap(ts => {
      return this.store.select(testExecutionSelectors.latestByTestSuite(ts));
    })

  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .map(m => m.get('suite'))
      .subscribe(suite => {
        this.store.dispatch(new LoadTestsuite(suite));
      });
    this.activatedRoute.queryParamMap.map(m => m.has('autorun'))
      .filter(x => x)
      .combineLatest(this.testSuite$.filter(notNull))
      .first()
      .subscribe(([_, ts]) => this.runTestSuiteComponent.runSuite(ts));
  }
}
