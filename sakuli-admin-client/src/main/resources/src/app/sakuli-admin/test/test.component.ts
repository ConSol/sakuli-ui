import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TestCase} from '../../sweetest-components/services/access/model/test-suite.model';
import {
  SakuliTestCase, SakuliTestSuite
} from '../../sweetest-components/services/access/model/sakuli-test-model';
import {TestRunInfo} from "../../sweetest-components/services/access/model/test-run-info.interface";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {project} from "../project/state/project.interface";
import {ProjectModel} from "../../sweetest-components/services/access/model/project.model";
import {notNull} from "../../core/redux.util";

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
export class TestComponent {
  project$: Observable<ProjectModel>;

  testSuite$: Observable<SakuliTestSuite>;
  testRunInfo$: Observable<TestRunInfo>;
  subTitle$: Observable<string>;
  title$: Observable<string>;
  testCases$: Observable<SakuliTestCase[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.project$ = this.store.select(project);
    this.testSuite$ = this.store.select(s => s.test.testSuite as SakuliTestSuite).filter(notNull);
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
