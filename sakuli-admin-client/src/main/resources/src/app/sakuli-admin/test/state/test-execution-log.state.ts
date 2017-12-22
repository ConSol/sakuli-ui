import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {uniqueName} from "../../../core/redux.util";
import {TestExecutionEvent} from "../../../sweetest-components/services/access/model/test-execution-event.interface";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {testExecutionSelectId, testExecutionSelectors, TestExecutionEntity} from "./testexecution.state";
import {IdMap} from "./test.interface";

export interface TestExecutionLogMessageEntity {
  executionId: string
  timestamp: number
  message: string
}

export interface TestExecutionLogState extends EntityState<TestExecutionLogMessageEntity> {

}

export const TestExecutionLogFeatureName = 'testexecutionlog';
export const testExecutionLogSelectId = e => e.timestamp;
export const testExecutionLogSortComparer = (e1, e2) => e1.timestamp - e2.timestamp;
const testExecutionLogEntityAdapter = createEntityAdapter<TestExecutionLogMessageEntity>({
  selectId: testExecutionLogSelectId,
  sortComparer: testExecutionLogSortComparer
});

export const testExecutionLogStateInit = testExecutionLogEntityAdapter.getInitialState();

export const APPEND_TEST_RUN_INFO_LOG = uniqueName('[test] appendtestruninfolog');
export class AppendTestRunInfoLog implements Action {
  readonly type = APPEND_TEST_RUN_INFO_LOG;
  private time = new Date();
  constructor(
    readonly testExecutionEvent: TestExecutionEvent
  ) {}

  get timestamp() {
    return this.time.getTime();
  }
}

export const CLEAR_LOG = '[test] CLEAR_LOG';
export class ClearLog implements Action {
  readonly type = CLEAR_LOG;
  constructor(
    readonly id?: string
  ) {}
}

export type TestExecutionLogActionTypes = ClearLog | AppendTestRunInfoLog;

const state = createFeatureSelector<TestExecutionLogState>(TestExecutionLogFeatureName);
const selectors = testExecutionLogEntityAdapter.getSelectors(state);

export const testExecutionLogSelectors = {
  state,
  ...selectors,
  byExecutionId(id: string) {
    return createSelector(selectors.selectAll, logs => logs.filter(log => log.executionId === id));
  },
  latestForTestSuite(testSuite: SakuliTestSuite) {
    return createSelector(
      selectors.selectAll,
      testExecutionSelectors.latestByTestSuite(testSuite),
      (entities:TestExecutionLogMessageEntity[], te:TestExecutionEntity) => {
        return (testSuite && te)
          ? (entities || [])
            .filter(e => e.executionId === te.containerId)
          : []
      }
    )
  }
};

export function testExecutionLogReducer(state: TestExecutionLogState = testExecutionLogStateInit, action: TestExecutionLogActionTypes) {
  switch (action.type) {
    case APPEND_TEST_RUN_INFO_LOG: {
      return testExecutionLogEntityAdapter.addOne({
        message: action.testExecutionEvent.message,
        timestamp: action.timestamp,
        executionId: action.testExecutionEvent.processId
      }, state);
    }
    case CLEAR_LOG: {
      if(action.id) {
        const toRemove = testExecutionLogSelectors.byExecutionId(action.id)(state);
        return testExecutionLogEntityAdapter.removeMany(toRemove.map(testExecutionLogSelectId), state);
      } else {
        return testExecutionLogEntityAdapter.removeAll(state);
      }
    }
  }
  return state || testExecutionLogStateInit;
}
