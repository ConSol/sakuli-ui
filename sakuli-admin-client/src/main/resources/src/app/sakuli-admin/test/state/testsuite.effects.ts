import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  LOAD_TESTSUITE, LoadTestsuite,
  LoadTestsuiteSuccess,
  RemoveAllTestsuites,
  UPDATE_TESTSUITE,
  UPDATE_TESTSUITE_SUCCESS,
  UpdateTestsuite,
  UpdateTestsuiteSuccess
} from "./testsuite.state";
import {ErrorMessage} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {OPEN_WORKSPACE} from "../../workspace/state/project.actions";
import {CloseAllTests} from "./test-editor.interface";

@Injectable()
export class TestsuiteEffects {

  constructor(readonly actions$: Actions,
              readonly testService: TestService) {
  }

  @Effect() update$ = this.actions$
    .ofType(UPDATE_TESTSUITE)
    .mergeMap((a: UpdateTestsuite) => {
      return this.testService
        .putTestSuite(a.testsuite)
        .mapTo(new UpdateTestsuiteSuccess(a.testsuite))
        .catch(ErrorMessage(`Error while saving ${a.testsuite.id}`));
    })

  @Effect() refresh$ = this.actions$
    .ofType(UPDATE_TESTSUITE_SUCCESS)
    .map((a: UpdateTestsuiteSuccess) => new LoadTestsuiteSuccess(a.testsuite));

  @Effect() loadTestSuite$ = this.actions$.ofType(LOAD_TESTSUITE)
    .mergeMap((loadTestSuite: LoadTestsuite) => this.testService
      .testSuite(loadTestSuite.path)
      .map(ts => new LoadTestsuiteSuccess(ts))
      .catch(ErrorMessage(`Unable to load testsuite from ${loadTestSuite.path}`))
    );

  @Effect() closeAfterOpen$ = this.actions$
    .ofType(OPEN_WORKSPACE)
    .mergeMap(() => [
      new RemoveAllTestsuites(),
      new CloseAllTests()
    ])

}
