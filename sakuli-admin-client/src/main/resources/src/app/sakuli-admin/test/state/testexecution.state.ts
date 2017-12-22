import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {uniqueName} from "../../../core/redux.util";
import {testSuiteSelectId} from "./testsuite.state";

export interface TestExecutionEntity extends TestRunInfo {
  isRunning: boolean,
  timestamp: number,
  testSuite: string
}

export interface TestExecutionState extends EntityState<TestExecutionEntity> {

}

export const TestExecutionFeatureName = 'testexecution';
export const testExecutionSelectId = e => e.containerId;
export const testExecutionSortComparer = (e1, e2) => e1.timestamp - e2.timestamp;
const testExecutionEntityAdapter = createEntityAdapter<TestExecutionEntity>({
  selectId: testExecutionSelectId,
  sortComparer: testExecutionSortComparer
});

const testExecutionStateInit = testExecutionEntityAdapter.getInitialState();


export const RUN_TEST = uniqueName('[test] runtest');
export class RunTest implements Action {
  readonly type = RUN_TEST;

  constructor(readonly testSuite: SakuliTestSuite) {
  }
}

export const SET_TEST_RUN_INFO = uniqueName('[test] settestruninfo');
export class SetTestRunInfo implements Action {
  readonly type = SET_TEST_RUN_INFO;
  private time = new Date();
  constructor(readonly testRunInfo: TestRunInfo,
              readonly testSuite?: SakuliTestSuite) {
  }

  get timestamp() {
    return this.time.getTime();
  }
}

export const TEST_EXECUTION_STARTED = uniqueName('[test] TEST_EXECUTION_STARTED');
export class TestExecutionStarted implements Action {
  readonly type = TEST_EXECUTION_STARTED;

  constructor(readonly id: string) {
  }
}

export const TEST_EXECUTION_COMPLETED = '[test] TEST_EXECUTION_COMPLETED';
export class TestExecutionCompleted implements Action {
  readonly type = TEST_EXECUTION_COMPLETED;

  constructor(readonly id: string) {
  }
}

export type TestExecutionActionTypes = RunTest
  | SetTestRunInfo
  | TestExecutionStarted
  | TestExecutionCompleted

const state = createFeatureSelector<TestExecutionState>(TestExecutionFeatureName);
const selectors = testExecutionEntityAdapter.getSelectors(state);

export const testExecutionSelectors = {
  state,
  ...selectors,
  byTestSuite(testsuite: SakuliTestSuite) {
    return createSelector(
      selectors.selectAll,
      execs => (execs || []).filter(exec => exec.testSuite === testSuiteSelectId(testsuite))
      )
  },
  latestByTestSuite(testsuite: SakuliTestSuite) {
    return createSelector(
      selectors.selectAll,
      execs => (execs || []).filter(exec => exec.testSuite === testSuiteSelectId(testsuite))[0]
    )
  }
};

export function testExecutionReducer(state: TestExecutionState = testExecutionStateInit, action: TestExecutionActionTypes) {
  switch (action.type) {
    case SET_TEST_RUN_INFO: {
      return testExecutionEntityAdapter.addOne({
        ...action.testRunInfo,
        timestamp: action.timestamp,
        isRunning: true,
        testSuite: testSuiteSelectId(action.testSuite)
      }, state);
    }
    case TEST_EXECUTION_COMPLETED: {
      return testExecutionEntityAdapter.updateOne({
        id: action.id,
        changes: {isRunning: false}
      }, state);
    }
  }
  return state || testExecutionStateInit
}
