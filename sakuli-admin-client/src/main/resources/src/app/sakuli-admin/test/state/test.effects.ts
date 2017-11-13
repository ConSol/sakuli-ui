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
import {SET_PROJECT, SetProject} from "../../project/state/project.actions";

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
import {Store} from "@ngrx/store";
import {SelectionState} from "../../../sweetest-components/model/tree";
import {
  LOAD_TESTSUITE, LOAD_TESTSUITE_SUCCESS, LoadTestsuite, LoadTestsuiteSuccess,
  testSuiteSelectId, testSuiteSelectors
} from "./testsuite.state";
import {SuccessToast} from "../../../sweetest-components/components/presentation/toast/toast.model";
import {CreateToast} from "../../../sweetest-components/components/presentation/toast/toast.actions";

@Injectable()
export class TestEffects {

  @Effect() loadTestSuite$ = this.actions$.ofType(LOAD_TESTSUITE)
    .mergeMap((loadTestSuite: LoadTestsuite) => this.testService
      .testSuite(loadTestSuite.path)
      .map(ts => new LoadTestsuiteSuccess(ts))
      .catch(ErrorMessage(`Unable to load testsuite from ${loadTestSuite.path}`))
    );

  @Effect() loadTestSuiteSuccessAddMenuItems = this.actions$.ofType(LOAD_TESTSUITE_SUCCESS)
    .withLatestFrom(this.store.select(menuSelectors.byParent(LayoutMenuService.Menus.SIDEBAR)))
    .map(([ats, items]: [LoadTestsuiteSuccess, IMenuItem[]]) => {
      const {testsuite} = ats;
      const {name, id} = testsuite;
      const parentId = `${LayoutMenuService.Menus.SIDEBAR}.${name}`;
      const order = items.length * 100;
      const basePath = ['/testsuite', testSuiteSelectId(testsuite)];
      function selectionState(id: string) {
        const found = items.find(i => menuSelectId(i) === id);
        return found ? found.selected : SelectionState.UnSelected;
      }
      const parentMenuItem = new MenuItem(
        parentId,
        id,
        basePath,
        FontawesomeIcons.cubes,
        LayoutMenuService.Menus.SIDEBAR,
        selectionState(parentId),
        order
      );
      const cases = testsuite.testCases.map((tc, i) => new MenuItem(
        `${parentId}.${tc.name}`,
        tc.name,
        [...basePath, 'sources', [tc.name, tc.mainFile].join('/')],
        FontawesomeIcons.code,
        parentId,
        selectionState(`${parentId}.${tc.name}`),
        order + (i * 10)
      ));
      const assetsMenuItem = new MenuItem(
        `${parentId}.assets`,
        'Assets',
        [...basePath, 'assets'],
        FontawesomeIcons.image,
        parentId,
        selectionState(`${parentId}.assets`),
        order + ((testsuite.testCases.length + 1) * 10)
      );
      const configurationMenuItem = new MenuItem(
        `${parentId}.configuration`,
        'Configuration',
        [...basePath, 'configuration'],
        FontawesomeIcons.wrench,
        parentId,
        selectionState(`${parentId}.configuration`),
        order + ((testsuite.testCases.length + 2) * 10)
      );
      return new AddAllMenuItems([parentMenuItem, ...cases, assetsMenuItem, configurationMenuItem]);
    });

  @Effect() runTest$ = this.actions$.ofType(RUN_TEST)
    .mergeMap((rt: RunTest) => this.testService.run(rt.testSuite).map(tri => new SetTestRunInfo(tri)));

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
    .withLatestFrom(this.store.select(testSuiteSelectors.selectAll))
    .mergeMap(([_, testSuites]) => Observable.forkJoin(
        ...testSuites.map(ts => this.testService.testResults(ts.root))
      ))
    .map(r => r.reduce((flat, tsa) => [...flat, ...tsa]), [])
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
  }

}
