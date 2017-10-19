import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  AppendTestRunInfoLog, DockerPullCompleted, DockerPullProgress, DockerPullStarted,
  DockerPullStream,
  LOAD_TESTRESULTS, LOAD_TESTRESULTS_SUCCESS, LOAD_TESTSUITE,
  LoadTestResultsSuccess,
  RUN_TEST, RunTest,
  SET_TEST_RUN_INFO,
  SetTestRunInfo,
  SetTestSuite, TEST_EXECUTION_COMPLETED, TestExecutionCompleted, TestExecutionStarted
} from "./test.actions";
import {SET_PROJECT, SetProject} from "../../project/state/project.actions";
import {CreateToast, ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";

import {Observable} from "rxjs/Observable";
import {ScLoadingService} from "../../../sweetest-components/components/presentation/loading/sc-loading.service";
import {
  ErrorMessage,
  SuccessToast
} from "../../../sweetest-components/components/presentation/toast/toast-state.interface";

@Injectable()
export class TestEffects {

  @Effect() loadTestSuite$ = this.actions$.ofType(LOAD_TESTSUITE)
    .mergeMap(_ => this.testService.testSuite().map(ts => new SetTestSuite(ts)));

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
      const noop = () => Observable.of({type:'_'});
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
    .catch(ErrorMessage('Unable to proceed server event'))

  @Effect() fetchLogFinish$ = this.actions$.ofType(TEST_EXECUTION_COMPLETED)
    .map(_ => new CreateToast(new SuccessToast('Finished test execution')));

  @Effect() projectOpen = this.actions$.ofType(SET_PROJECT)
    .map((sp: SetProject) => new SetTestSuite(sp.project.testSuite));

  @Effect() loadTestResults = this.actions$.ofType(LOAD_TESTRESULTS)
    .mergeMap(_ => this.testService.testResults())
    .map(r => new LoadTestResultsSuccess(r))
    .catch(ErrorMessage('Unable to load test results'))
  ;

  @Effect() loadingTestResult = this.loading.registerLoadingActions(
    "loadingTestResults",
    LOAD_TESTRESULTS,
    LOAD_TESTRESULTS_SUCCESS
  );

  constructor(private testService: TestService,
              private actions$: Actions,
              private loading: ScLoadingService,
              private toasts: ScToastService) {
  }

}
