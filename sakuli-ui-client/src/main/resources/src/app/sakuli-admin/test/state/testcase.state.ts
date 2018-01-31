import {SakuliTestCase} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Action} from "@ngrx/store";

export interface TestCaseState extends EntityState<SakuliTestCase> {

}

export const testcaseEntityAdapter = createEntityAdapter<SakuliTestCase>({
  selectId: tc => tc.name
});

export const testcaseStateInitial = testcaseEntityAdapter.getInitialState();

export const ADDALL_TESTCASE = '[TESTCASE] ADDALL';
export class AddAllTestcase implements Action {
  readonly type = ADDALL_TESTCASE;
  constructor(
    readonly testcases: SakuliTestCase[]
  ) {}
}

export type TestCaseAction = AddAllTestcase

export function testCaseReducer(state: TestCaseState = testcaseStateInitial, action: TestCaseAction) {
  switch (action.type) {
    case ADDALL_TESTCASE: {
      return testcaseEntityAdapter.addAll(action.testcases, state);
    }
    default:
      return state
  }
}
