import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {MenuState} from "../../../sweetest-components/components/layout/menu/menu.state";

export interface TestSuiteState extends EntityState<SakuliTestSuite> {

}

export const testSuiteSelectId = ts => ts.root;

export const testSuiteEntityAdapter = createEntityAdapter<SakuliTestSuite>({
  selectId: testSuiteSelectId
});

export const testSuiteStateInitial = testSuiteEntityAdapter.getInitialState();

export const LOAD_TESTSUITE = '[TESTSUITE] LOAD';
export class LoadTestsuite implements Action {
  readonly type = LOAD_TESTSUITE;
  constructor(
    readonly path: string
  ) {}
}

export const LOAD_TESTSUITE_SUCCESS = '[TESTSUITE] LOAD Success';
export class LoadTestsuiteSuccess implements Action {
  readonly type = LOAD_TESTSUITE_SUCCESS;
  constructor(
    readonly testsuite: SakuliTestSuite
  ) {}
}

export const LOAD_TESTSUITE_ERROR = '[TESTSUITE] LOAD Error';
export class LoadTestsuiteError implements Action {
  readonly type = LOAD_TESTSUITE_ERROR;
  constructor(
    readonly error: Error
  ) {}
}

export const UPDATE_TESTSUITE = '[TESTSUITE] UPDATE';
export class UpdateTestsuite implements Action {
  readonly type = UPDATE_TESTSUITE;
  constructor(
    readonly testsuite: SakuliTestSuite
  ) {}
}

export const UPDATE_TESTSUITE_SUCCESS = '[TESTSUITE] UPDATE Success';
export class UpdateTestsuiteSuccess implements Action {
  readonly type = UPDATE_TESTSUITE_SUCCESS;
  constructor(
    readonly testsuite: SakuliTestSuite
  ) {}
}

export const UPDATE_TESTSUITE_ERROR = '[TESTSUITE] UPDATE Error';
export class UpdateTestsuiteError implements Action {
  readonly type = UPDATE_TESTSUITE_ERROR;
  constructor(
    readonly error: Error
  ) {}
}

const selectors = testSuiteEntityAdapter.getSelectors(createFeatureSelector<TestSuiteState>('testsuite'));

function testCasesFor(testSuite: SakuliTestSuite) {
  return createSelector(
    byId(testSuiteSelectId(testSuite)),
    (ts) => ts.testCases || []
  )
}

function byId(id: string) {
  return createSelector(
    selectors.selectEntities,
    (tcs) => tcs[id]
  )
}

export const testSuiteSelectors = {
  ...selectors,
  testCasesFor,
  byId
}

export type TestsuiteActions = LoadTestsuite | LoadTestsuiteSuccess | LoadTestsuiteError;

export function testsuiteReducer(state: TestSuiteState = testSuiteStateInitial, action: TestsuiteActions) {
  switch (action.type) {
    case LOAD_TESTSUITE_SUCCESS: {
      const {testsuite} = action;
      const id = testSuiteSelectId(testsuite);
      if((id in state.entities)) {
        return testSuiteEntityAdapter.updateOne({id: testSuiteSelectId(testsuite), changes: testsuite}, state);
      } else {
        return testSuiteEntityAdapter.addOne(testsuite, state);
      }
    }
  }
  return state;
}
