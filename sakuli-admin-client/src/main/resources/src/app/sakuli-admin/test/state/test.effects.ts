import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  AppendTestRunInfoLog, DockerPullCompleted, DockerPullProgress, DockerPullStarted,
  DockerPullStream,
  LOAD_TESTRESULTS, LOAD_TESTRESULTS_SUCCESS,
  LoadTestResultsSuccess,
  RUN_TEST, RunTest,
  SET_TEST_RUN_INFO,
  SetTestRunInfo,
  TEST_EXECUTION_COMPLETED, TestExecutionCompleted, TestExecutionStarted
} from "./test.actions";
import {SET_PROJECT, SetProject} from "../../workspace/state/project.actions";

import {Observable} from "rxjs/Observable";
import {ScLoadingService} from "../../../sweetest-components/components/presentation/loading/sc-loading.service";
import {
  ErrorMessage,
} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {IMenuItem, MenuItem} from "../../../sweetest-components/components/layout/menu/menu-item.interface";
import {FontawesomeIcons} from "../../../sweetest-components/components/presentation/icon/fontawesome-icon.utils";
import {LayoutMenuService} from "../../../sweetest-components/components/layout/menu/layout-menu.service";
import {
  AddAllMenuItems, menuSelectId,
  menuSelectors
} from "../../../sweetest-components/components/layout/menu/menu.state";
import {AppState} from "../../appstate.interface";
import {createSelector, Store} from "@ngrx/store";
import {SelectionState} from "../../../sweetest-components/model/tree";
import {
  LOAD_TESTSUITE, LOAD_TESTSUITE_SUCCESS, LoadTestsuite, LoadTestsuiteSuccess,
  testSuiteSelectId, testSuiteSelectors
} from "./testsuite.state";
import {SuccessToast} from "../../../sweetest-components/components/presentation/toast/toast.model";
import {CreateToast} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {log, notNull} from "../../../core/redux.util";
import {workpaceSelectors} from "../../workspace/state/project.interface";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";

@Injectable()
export class TestEffects {

  @Effect() loadTestSuite$ = this.actions$.ofType(LOAD_TESTSUITE)
    .mergeMap((loadTestSuite: LoadTestsuite) => this.testService
      .testSuite(loadTestSuite.path)
      .map(ts => new LoadTestsuiteSuccess(ts))
      .catch(ErrorMessage(`Unable to load testsuite from ${loadTestSuite.path}`))
    );

  @Effect() runTest$ = this.actions$.ofType(RUN_TEST)
    .withLatestFrom(this.store.select(workpaceSelectors.workspace))
    .mergeMap(([rt, workspace]: [RunTest, string]) => this.testService.run(rt.testSuite, workspace).map(tri => new SetTestRunInfo(tri)));

  @Effect() runTestLoading$ = this.loading.registerLoadingActions(
    'runTest',
    RUN_TEST,
    SET_TEST_RUN_INFO
  );

  @Effect() fetchLogs$ = this.actions$.ofType(SET_TEST_RUN_INFO)
    .mergeMap((tri: SetTestRunInfo) => this.testService.testRunLogs(tri.testRunInfo.containerId))
    .groupBy(tee => tee.type)
    .mergeMap(gtee$ => {
      const noop = () => Observable.of({type: '_'});
      return (({
        'test.log': () => gtee$.map(se => new AppendTestRunInfoLog(se)),
        'test.lifecycle.started': () => gtee$.map(({processId}) => new TestExecutionStarted(processId)),
        'test.lifecycle.completed': () => gtee$.map(({processId}) => new TestExecutionCompleted(processId)),
        'docker.pull.started': () => gtee$.map(({processId}) => new DockerPullStarted(processId)),
        'docker.pull.progress': () => Observable.merge(
          gtee$.map(se => new DockerPullProgress(se.processId, JSON.parse(se.message)))
            .filter(dpg => !!dpg.info.id && !!dpg.info.status)
            .groupBy(dpg => dpg.info.id)
            .mergeMap(dpgg$ => dpgg$.throttleTime(250)),
          gtee$.map(se => new DockerPullProgress(se.processId, JSON.parse(se.message)))
            .filter(dpg => !!dpg.info.stream)
            .map(dpg => new DockerPullStream(dpg.id, dpg.info))),
        'test.pull.completed': () => ({processId}) => new DockerPullCompleted(processId)
      })[gtee$.key] || noop)();
    })
    .catch(ErrorMessage('Unable to proceed server event'));

  @Effect() fetchLogFinish$ = this.actions$.ofType(TEST_EXECUTION_COMPLETED)
    .map(_ => new CreateToast(new SuccessToast('Finished test execution')));

  @Effect() projectOpen = this.actions$.ofType(SET_PROJECT)
    .map((sp: SetProject) => new LoadTestsuiteSuccess(sp.project.testSuite));

  @Effect() loadTestResults = this.actions$.ofType(LOAD_TESTRESULTS)
    .withLatestFrom(this.store.select(
        testSuiteSelectors.selectAll
    ).filter(notNull))
    .mergeMap(([_, suites]) => Observable.forkJoin(
        ...suites.map(ts => this.testService.testResults(ts.root))
      ))
    .map((r: TestSuiteResult[][]) => r.reduce((flat, tsa) => [...flat, ...tsa]), [])
    .map(r => new LoadTestResultsSuccess(r))
    .catch(ErrorMessage('Unable to load test results'))
  ;

  @Effect() loadingTestResult = this.loading.registerLoadingActions(
    "loadingTestResults",
    LOAD_TESTRESULTS,
    LOAD_TESTRESULTS_SUCCESS
  );

  constructor(private testService: TestService,
              private store: Store<AppState>,
              private actions$: Actions,
              private loading: ScLoadingService,) {
    console.log('Test effects');
  }

}
