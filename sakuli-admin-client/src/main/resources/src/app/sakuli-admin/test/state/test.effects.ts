import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  APPEND_TEST_RUN_INFO_LOG,
  AppendTestRunInfoLog, LOAD_TESTRESULTS, LOAD_TESTSUITE, LoadTestResultsSuccess, RUN_TEST, RunTest, SET_TEST_RUN_INFO,
  SetTestRunInfo,
  SetTestSuite
} from "./test.actions";
import {OPEN, SET_PROJECT, SetProject} from "../../project/state/project.actions";
import {log} from "../../../core/redux.util";
import {
  LoadingSetBusy,
  LoadingSetIdle
} from "../../../sweetest-components/components/presentation/loading/sc-loading.state";
import {LogModalComponent} from "../test-detail/log-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {ScModalService} from "../../../sweetest-components/components/presentation/modal/sc-modal.service";

@Injectable()
export class TestEffects {
  modalComponent: LogModalComponent;

  @Effect() loadTestSuite$ = this.actions$.ofType(LOAD_TESTSUITE)
    .mergeMap(_ => this.testService.testSuite().map(ts => new SetTestSuite(ts)));

  @Effect() runTestLoading$ = this.actions$.ofType(RUN_TEST)
    .map(_ => new LoadingSetBusy('runTest'))

  @Effect() runTest$ = this.actions$.ofType(RUN_TEST)
    .mergeMap((rt: RunTest) => this.testService.run(rt.testSuite).map(tri => new SetTestRunInfo(tri)));

  @Effect() fetchLogLoadingFinish$ = this.actions$.ofType(SET_TEST_RUN_INFO)
    .map(_ => new LoadingSetIdle('runTest'))

  @Effect() fetchLog$ = this.actions$.ofType(SET_TEST_RUN_INFO)
    .do(_ => {
      console.log('Open  modal')
      this.modal
        .open(LogModalComponent, {}, modal => this.modalComponent = modal)
        .then(
          _ => this.modalComponent = null,
          _ => this.modalComponent = null);
    })
    .mergeMap((tri:SetTestRunInfo) => this.testService.testRunLogs(tri.testRunInfo.containerId))
    .map(se => new AppendTestRunInfoLog(se));

  @Effect({dispatch: false}) fetchLogFinish$ = this.actions$.ofType(APPEND_TEST_RUN_INFO_LOG)
    .filter((a: AppendTestRunInfoLog) => a.socketEvent.message === 'disconnect')
    .do(_ => {
      console.log('modal', this.modalComponent);
      if(this.modalComponent) {
        this.modalComponent.close();
      }
      this.toasts.create({
        type: 'success',
        message: 'Finished test execution'
      })
    })

  @Effect() projectOpen = this.actions$.ofType(SET_PROJECT)
    .map((sp: SetProject) => new SetTestSuite(sp.project.testSuite));

  @Effect() loadTestResults = this.actions$.ofType(LOAD_TESTRESULTS)
    .mergeMap(_ => this.testService.testResults())
    .map(r => new LoadTestResultsSuccess(r));

  constructor(
    private testService: TestService,
    private actions$: Actions,
    private modal: ScModalService,
    private toasts: ScToastService
  ) {}

}
