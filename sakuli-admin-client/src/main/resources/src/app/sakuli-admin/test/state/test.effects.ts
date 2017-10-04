import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  AppendTestRunInfoLog, DockerPullCompleted, DockerPullProgress, DockerPullStarted,
  DockerPullStream,
  LOAD_TESTRESULTS, LOAD_TESTSUITE,
  LoadTestResultsSuccess,
  RUN_TEST, RunTest,
  SET_TEST_RUN_INFO,
  SetTestRunInfo,
  SetTestSuite, TEST_EXECUTION_COMPLETED, TEST_EXECUTION_STARTED, TestExecutionCompleted, TestExecutionStarted
} from "./test.actions";
import {SET_PROJECT, SetProject} from "../../project/state/project.actions";
import {
  LoadingSetBusy,
  LoadingSetIdle
} from "../../../sweetest-components/components/presentation/loading/sc-loading.state";
import {LogModalComponent} from "../test-detail/log-modal.component";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {ScModalService} from "../../../sweetest-components/components/presentation/modal/sc-modal.service";
import {TestExecutionEvent} from "../../../sweetest-components/services/access/model/test-execution-event.interface";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TestEffects {
  modalComponent: LogModalComponent;

  @Effect() loadTestSuite$ = this.actions$.ofType(LOAD_TESTSUITE)
    .mergeMap(_ => this.testService.testSuite().map(ts => new SetTestSuite(ts)));

  @Effect() runTestLoading$ = this.actions$.ofType(RUN_TEST)
    .map(_ => new LoadingSetBusy('runTest'));

  @Effect() runTest$ = this.actions$.ofType(RUN_TEST)
    .mergeMap((rt: RunTest) => this.testService.run(rt.testSuite).map(tri => new SetTestRunInfo(tri)));

  @Effect() fetchLogLoadingFinish$ = this.actions$.ofType(SET_TEST_RUN_INFO)
    .map(_ => new LoadingSetIdle('runTest'));

  @Effect({dispatch: false}) testExecutionStarts$ = this.actions$.ofType(TEST_EXECUTION_STARTED)
    .do(_ => {
      console.log('Started');
      this.modal
        .open(LogModalComponent, {}, modal => this.modalComponent = modal)
        .then(
          _ => this.modalComponent = null,
          _ => this.modalComponent = null);
    })

  private filterSocketEventsToEffect<A extends Action>(socketEventType: string, ac: (se: TestExecutionEvent) => A): Observable<A> {
    return this.fetchLog$
      .filter(se => se.type === socketEventType)
      .map(ac);
  }

  @Effect({dispatch: false}) fetchLog$ = this.actions$.ofType(SET_TEST_RUN_INFO)
    .mergeMap((tri: SetTestRunInfo) => this.testService.testRunLogs(tri.testRunInfo.containerId));

  @Effect() appTestRunInfog$ = this.filterSocketEventsToEffect(
    'test.log', se => new AppendTestRunInfoLog(se));

  @Effect() testExecutionStartedT$ = this.filterSocketEventsToEffect(
    'test.lifecycle.started', ({processId}) => new TestExecutionStarted(processId));

  @Effect() testExecutionCompleted$ = this.filterSocketEventsToEffect(
    'test.lifecycle.completed', ({processId}) => new TestExecutionCompleted(processId));

  @Effect() dockerPullStarted$ = this.filterSocketEventsToEffect(
    'docker.pull.started', ({processId}) => new DockerPullStarted(processId));

  @Effect() dockerPullProgress$ = this.filterSocketEventsToEffect(
    'docker.pull.progress', se => new DockerPullProgress(se.processId, JSON.parse(se.message)))
    .filter(dpg => !!dpg.info.id && !!dpg.info.status)
    .groupBy(dpg => dpg.info.id)
    .mergeMap(dpgg$ => dpgg$.throttleTime(250));

  @Effect() dockerPullStream$ = this.filterSocketEventsToEffect(
    'docker.pull.progress', se => new DockerPullProgress(se.processId, JSON.parse(se.message)))
    .filter(dpg => !!dpg.info.stream)
    .map(dpg => new DockerPullStream(dpg.id, dpg.info));

  @Effect() dockerPullCompleted$ = this.filterSocketEventsToEffect(
    'test.pull.completed', ({processId}) => new DockerPullCompleted(processId));


  @Effect({dispatch: false}) fetchLogFinish$ = this.actions$.ofType(TEST_EXECUTION_COMPLETED)
    .do(_ => {
      if (this.modalComponent) {
        this.modalComponent.close();
      }
      this.toasts.create({
        type: 'success',
        message: 'Finished test execution'
      })
    });

  @Effect() projectOpen = this.actions$.ofType(SET_PROJECT)
    .map((sp: SetProject) => new SetTestSuite(sp.project.testSuite));

  @Effect() loadTestResults = this.actions$.ofType(LOAD_TESTRESULTS)
    .mergeMap(_ => this.testService.testResults())
    .map(r => new LoadTestResultsSuccess(r));

  constructor(private testService: TestService,
              private actions$: Actions,
              private modal: ScModalService,
              private toasts: ScToastService) {
  }

}
