import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
  SakuliTestCase, SakuliTestSuite
} from '../../sweetest-components/services/access/model/sakuli-test-model';
import {TestRunInfo} from "../../sweetest-components/services/access/model/test-run-info.interface";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {project} from "../project/state/project.interface";
import {ProjectModel} from "../../sweetest-components/services/access/model/project.model";
import {log, notNull} from "../../core/redux.util";
import {LoadTestsuite, testSuiteSelectors} from "./state/testsuite.state";
import {ActivatedRoute} from "@angular/router";

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
          [project]="project$ | async"
        ></run-test-suite>
      </article>
    </sc-content>
  `,
  styles: [`
  `]
})
export class TestComponent implements OnInit {
  project$: Observable<ProjectModel>;

  testSuite$: Observable<SakuliTestSuite>;
  testRunInfo$: Observable<TestRunInfo>;
  subTitle$: Observable<string>;
  title$: Observable<string>;
  testCases$: Observable<SakuliTestCase[]>;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {
    this.project$ = this.store.select(project);
    this.testSuite$ = this.activatedRoute.params
      .map(p => p['suite']).filter(notNull)
      .mergeMap(id => this.store.select(testSuiteSelectors.byId(decodeURIComponent(id))))
    this.title$ = this.testSuite$.map(ts => ts ? ts.configuration.id : '');
    this.subTitle$ = this.testSuite$.map(ts => ts ? ts.configuration.name : '');
    this.testCases$ = this.testSuite$.map(ts => ts.testCases);
    this.testRunInfo$ = this.store.select(s => s.test.testRunInfo);

  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .map(m => m.get('suite'))
      .subscribe(suite => {
        this.store.dispatch(new LoadTestsuite(suite));
      })
  }
}
