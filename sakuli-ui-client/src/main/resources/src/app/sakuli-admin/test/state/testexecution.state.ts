import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {Action, createFeatureSelector, createSelector, MemoizedSelector} from "@ngrx/store";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {notNull, uniqueName} from "../../../core/redux.util";
import {testSuiteSelectId} from "./testsuite.state";
import {TestExecutionEvent} from "../../../sweetest-components/services/access/model/test-execution-event.interface";

export interface TestExecutionEntity extends TestRunInfo {
  isRunning: boolean,
  timestamp: number,
  testSuite: string,
  vncReady: boolean
}

export interface TestExecutionState extends EntityState<TestExecutionEntity> {

}

export const TestExecutionFeatureName = 'testexecution';
export const testExecutionSelectId = e => e.executionId;
export const testExecutionSortComparer = (e1, e2) => e1.timestamp - e2.timestamp;
const testExecutionEntityAdapter = createEntityAdapter<TestExecutionEntity>({
  selectId: testExecutionSelectId,
  sortComparer: testExecutionSortComparer
});

export const testExecutionStateInit = testExecutionEntityAdapter.getInitialState();


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

  constructor(readonly event: TestExecutionEvent) {
    console.log('Invoke started action', event);
  }
}

export const TEST_EXECUTION_COMPLETED = '[test] TEST_EXECUTION_COMPLETED';
export class TestExecutionCompleted implements Action {
  readonly type = TEST_EXECUTION_COMPLETED;
  constructor(readonly id: string) {
  }
}

export const TEST_EXECUTION_STOPPED = '[test] TEST_EXECUTION_STOPPED';
export class TestExecutionStopped implements Action {
  readonly type = TEST_EXECUTION_STOPPED;
  constructor(
    readonly id: string
  ) {}
}

export const TEST_EXECUTION_SET_VNC_READY = '[TEST_EXECUTION] SET_VNC_READY';
export class TestExecutionSetVncReady implements Action {
  readonly type = TEST_EXECUTION_SET_VNC_READY;
  constructor(
    readonly executionId: string,
    readonly vncReady: boolean
  ) {}
}

export type TestExecutionActionTypes = RunTest
  | SetTestRunInfo
  | TestExecutionStarted
  | TestExecutionCompleted
  | TestExecutionSetVncReady
  | TestExecutionStopped

const state = createFeatureSelector<TestExecutionState>(TestExecutionFeatureName);
const selectors = testExecutionEntityAdapter.getSelectors(state);

export const testExecutionSelectors = {
  state,
  ...selectors,
  byTestSuite(testsuite: SakuliTestSuite): MemoizedSelector<any, TestExecutionEntity[]> {
    return createSelector(
      selectors.selectAll,
      execs =>  {
        return (execs || [])
          .filter(notNull)
          .filter(exec => exec.testSuite === testSuiteSelectId(testsuite))
      }
      )
  },
  latestByTestSuite(testsuite: SakuliTestSuite) {
    return createSelector(
      this.byTestSuite(testsuite),
      (execs: TestExecutionEntity[])=>  {
        return (execs || []).reduce((min, c) => min.timestamp >= c.timestamp ? min : c, execs[0])
      }
    );
  },
};

export function testExecutionReducer(state: TestExecutionState = testExecutionStateInit, action: TestExecutionActionTypes) {
  switch (action.type) {
    case TEST_EXECUTION_STARTED: {
      const {type, event} = action;
      return testExecutionEntityAdapter.updateOne({
        id: event.processId,
        changes: {containerId: event.message}
      }, state)
    }
    case SET_TEST_RUN_INFO: {
      return testExecutionEntityAdapter.addOne({
        ...action.testRunInfo,
        timestamp: action.timestamp,
        isRunning: true,
        testSuite: testSuiteSelectId(action.testSuite),
        vncReady: false
      }, state);
    }
    case TEST_EXECUTION_SET_VNC_READY: {
      const {executionId, vncReady} = action;
      return testExecutionEntityAdapter.updateOne({
        id: executionId,
        changes: {vncReady}
      }, state)
    }
    case TEST_EXECUTION_COMPLETED: {
      return testExecutionEntityAdapter.updateOne({
        id: action.id,
        changes: {
          isRunning: false,
          vncReady: false
        }
      }, state);
    }
    case TEST_EXECUTION_STOPPED: {
      return testExecutionEntityAdapter.updateOne({
        id: action.id,
        changes: {
          isRunning: false,
          vncReady: false
        }
      }, state)
    }
  }
  return state || testExecutionStateInit
}
