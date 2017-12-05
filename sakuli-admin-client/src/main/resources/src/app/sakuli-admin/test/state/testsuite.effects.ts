import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  LoadTestsuiteSuccess,
  RemoveAllTestsuites,
  UPDATE_TESTSUITE,
  UPDATE_TESTSUITE_SUCCESS,
  UpdateTestsuite,
  UpdateTestsuiteSuccess
} from "./testsuite.state";
import {ErrorMessage} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {OPEN} from "../../workspace/state/project.actions";
import {RemoveMenuitem} from "../../../sweetest-components/components/layout/menu/menu.state";
import {LayoutMenuService} from "../../../sweetest-components/components/layout/menu/layout-menu.service";

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
    .map((a: UpdateTestsuiteSuccess) => new LoadTestsuiteSuccess(a.testsuite))

  @Effect() closeAfterOpen$ = this.actions$
    .ofType(OPEN)
    .mergeMap(_ => [
      new RemoveAllTestsuites(),
      new RemoveMenuitem(LayoutMenuService.Menus.SIDEBAR)
    ])

}
