import {TestState, TestStateInit} from './test.interface';
import * as Actions from './test.actions';
import {
  actionTypeFor,
  AsyncActionLifecycle
} from "../../../sweetest-components/services/ngrx-util/action-creator-metadata";
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {Action} from "@ngrx/store";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {Type} from "@angular/core";

export function testReducer(state: TestState, action: Actions.AllTypes): TestState {
  switch (action.type) {
    case Actions.SET_TESTSUITE: {
      const {testSuite} = action;
      return ({...state, testSuite})
    }
    case Actions.OPEN_TEST: {
      const {testCase: activeTest} = action;
      const hasTest = state.openTests.indexOf(activeTest) > -1 || activeTest === '';
      return ({ ...state,
        activeTest: activeTest === '' ? null : activeTest,
        openTests: hasTest ? state.openTests : [...state.openTests, activeTest]
      })
    }
    case Actions.CLOSE_TEST: {
      const {testCase} = action;
      const idx = state.openTests.indexOf(testCase);
      const openTests = state.openTests.filter(ot => ot !== testCase);
      return ({
        ...state,
        openTests,
        activeTest: openTests[idx % openTests.length]
      })
    }
    case Actions.SET_TEST_RUN_INFO: {
      const {testRunInfo} = action;
      return ({
        ...state,
        testRunInfo,
        testRunInfoLogs: {...state.testRunInfoLogs, [testRunInfo.containerId]: []}
      })
    }
    case Actions.LOAD_TESTRESULTS_SUCCESS: {
      return ({...state, testResults: action.results})
    }
    case Actions.APPEND_TEST_RUN_INFO_LOG: {
      const {socketEvent} = action;
      return ({
        ...state,
        testRunInfoLogs: {...state.testRunInfoLogs,
          [socketEvent.processId]: [...(state.testRunInfoLogs[socketEvent.processId] || []), socketEvent.message]}
      })
    }
    case Actions.CLEAR_LOG: {
      return {...state};
    }
    default:
      return reduceAsync(state || TestStateInit, action as Action);
  }
}

const isAsyncSuccess = <T>(action: Action, type: Type<T>, method: keyof T): action is Action&{payload:T[keyof T]} => {
  return action.type === actionTypeFor(type, method, AsyncActionLifecycle.Success);
}

function reduceAsync(state: TestState, action: Action) {
  if(isAsyncSuccess(action, TestService, "testResults")) {

  }

  switch (action.type) {
    case actionTypeFor(TestService, 'testResults', AsyncActionLifecycle.Success): {
      const {payload} = action as Action&{payload: TestSuiteResult[]};
      return ({...state, testResults: payload})
    }
  }
  return state;
}
