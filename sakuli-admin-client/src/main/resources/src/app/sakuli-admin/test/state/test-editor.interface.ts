import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {uniqueName} from "../../../core/redux.util";
import {nothrowFn} from "../../../core/utils";
import {testSuiteSelectors, TestSuiteState} from "./testsuite.state";
import {nothrow} from "nothrow";
import {SakuliTestCase, SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {Dictionary} from "@ngrx/entity/src/models";

export const TestEditorFeatureName = 'testEditor';
export const testEditorId = (e: TestEditorEntity) => e.id;

export interface TestEditorEntity {
  id: string;
  testSuite: string;
  testCase: string;
}

export interface TestEditorState extends EntityState<TestEditorEntity> {
  selected: string;
}

export const testEditorEntityAdapter = createEntityAdapter({
  selectId: testEditorId,
});


export const testEditorStateInit = testEditorEntityAdapter.getInitialState({
  selected: ''
});

const testEditorState = createFeatureSelector<TestEditorState>(TestEditorFeatureName);
const selectors = testEditorEntityAdapter.getSelectors(testEditorState);

const selectedId = createSelector(
  testEditorState,
  nothrowFn(s => s.selected)
);

const selectedEntity = createSelector(
  selectedId,
  selectors.selectEntities,
  (id, e) => e[id]
)

const selectedTestSuite = createSelector(
  selectedEntity,
  testSuiteSelectors.selectEntities,
  nothrowFn<TestEditorEntity, Dictionary<SakuliTestSuite>, SakuliTestSuite>((selected, testSuites) => testSuites[selected.testSuite])
);

const selectedTestCase = createSelector(
  selectedEntity,
  selectedTestSuite,
  nothrowFn<TestEditorEntity, SakuliTestSuite, SakuliTestCase>((selected, suite) => suite
    .testCases
    .find(tc => selected.testCase === `${tc.name}/${tc.mainFile}`)
  )
);

export const testEditorSelectors = {
  ...selectors,
  testEditorState,
  selectedId,
  selectedTestSuite,
  selectedTestCase
};


export const OPEN_TEST = uniqueName('[test] opentest');
export class OpenTest implements Action {
  readonly type = OPEN_TEST;
  constructor(
    readonly testSuite: string,
    readonly testCase: string
  ) {}
}

export const CLOSE_TEST = uniqueName('[test] closetest');
export class CloseTest implements Action {
  readonly type = CLOSE_TEST;
  constructor(
    readonly id: string
  ) {}
}

export const CLOSE_ALL_TESTS = '[test] CLOSE_ALL';
export class CloseAllTests implements Action {
  readonly type = CLOSE_ALL_TESTS;
  constructor() {}
}

export const RESET_SELECTEDTESTCASE = '[SELECTEDTESTCASE] RESET';
export class ResetSelectedTestcase implements Action {
  readonly type = RESET_SELECTEDTESTCASE;
  constructor() {}
}

export type TestEditorActions = OpenTest | CloseTest | ResetSelectedTestcase | CloseAllTests;

export function testEditorReducer(state: TestEditorState, action: TestEditorActions) {
  switch (action.type) {
    case OPEN_TEST: {
      const {testCase, testSuite} = action;
      const id = `${testSuite}${testCase}`;
      const _state = testEditorEntityAdapter.addOne({testCase, testSuite, id}, state);
      return ({..._state, selected: id});
    }
    case RESET_SELECTEDTESTCASE: {
      return ({...state, selected: ''});
    }
    case CLOSE_TEST: {
      return testEditorEntityAdapter.removeOne(action.id, state);
    }
    case CLOSE_ALL_TESTS: {
      return testEditorEntityAdapter.removeAll(state);
    }
    default:
      return state || testEditorStateInit
  }
}
