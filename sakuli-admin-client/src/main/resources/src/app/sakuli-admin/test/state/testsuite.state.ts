import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {MenuState} from "../../../sweetest-components/components/layout/menu/menu.state";
import {uniqueName} from "../../../core/redux.util";
import {selectToastId} from "../../../sweetest-components/components/presentation/toast/toast-state.interface";

export interface TestSuiteState extends EntityState<SakuliTestSuite> {
  selectedTestSuite: string;
}

export const TestSuiteFeatureName = 'testsuite';

export const testSuiteSelectId = ts => ts.root;

export const testSuiteEntityAdapter = createEntityAdapter<SakuliTestSuite>({
  selectId: testSuiteSelectId,
});

export const testSuiteStateInit = {
  ...testSuiteEntityAdapter.getInitialState(),
  selectedTestSuite: ''
};

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

export const SELECT_TESTSUITE = uniqueName('[TESTSUITE] SELECT');
export class SelectTestsuite implements Action {
  readonly type = SELECT_TESTSUITE;
  constructor(
    readonly testSuite: SakuliTestSuite
  ) {}
}

export const REMOVEALL_TESTSUITES = '[TESTSUITE] REMOVEALL';
export class RemoveAllTestsuites implements Action {
  readonly type = REMOVEALL_TESTSUITES;
  constructor() {}
}

const selectors = testSuiteEntityAdapter.getSelectors(createFeatureSelector<TestSuiteState>('testsuite'));
const testSuiteState = createFeatureSelector<TestSuiteState>(TestSuiteFeatureName);

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

function selectedTestSuite() {
  const idSelector = createSelector(
    testSuiteState,
    (s) => s.selectedTestSuite
  );
  return createSelector(idSelector, byId);
}

export const testSuiteSelectors = {
  ...selectors,
  testCasesFor,
  byId,
  selectedTestSuite
};


export type TestsuiteActions = LoadTestsuite | LoadTestsuiteSuccess | LoadTestsuiteError | SelectTestsuite | RemoveAllTestsuites;

export function testsuiteReducer(state: TestSuiteState = testSuiteStateInit, action: TestsuiteActions) {
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
    case SELECT_TESTSUITE: {
      const {testSuite} = action;
      const id = testSuiteSelectId(testSuite);
      return ({
        ...state,
      })
    }
    case REMOVEALL_TESTSUITES: {
      return testSuiteEntityAdapter.removeAll(state);
    }
  }
  return state || testSuiteStateInit;
}
