import {DockerPullInfo, TestState, TestStateInit} from './test.interface';
import * as Actions from './test.actions';

export function testReducer(state: TestState = TestStateInit, action: Actions.AllTypes): TestState {
  switch (action.type) {
    case Actions.OPEN_TEST: {
      const {testCase: activeTest} = action;
      const hasTest = state.openTests.indexOf(activeTest) > -1 || activeTest === '';
      return ({
        ...state,
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
      const {testExecutionEvent} = action;
      return ({
        ...state,
        testRunInfoLogs: {
          ...state.testRunInfoLogs,
          [testExecutionEvent.processId]: [...(state.testRunInfoLogs[testExecutionEvent.processId] || []), testExecutionEvent.message.trim()]
        }
      })
    }
    case Actions.CLEAR_LOG: {
      return {...state};
    }
    case Actions.DOCKER_PULL_STARTED: {
      return ({
        ...state, dockerPullInfo: {
          ...state.dockerPullInfo, [action.id]: {}
        }
      })
    }
    case Actions.DOCKER_PULL_PROGRESS: {
      const {info} = action;
      const prevInfo = ((state.dockerPullInfo[action.id] || {})[info.id]);
      const updateInfo = function (prev: DockerPullInfo, next: DockerPullInfo): DockerPullInfo {
        if (prev.progressDetail && !next.progressDetail) {
          return ({...prev, status: next.status})
        }
        return next;
      };
      return ({
        ...state, dockerPullInfo: {
          ...state.dockerPullInfo,
          [action.id]: {
            ...(state.dockerPullInfo[action.id] || {}),
            [info.id]: prevInfo ? updateInfo(prevInfo, info) : info
          }
        }
      })
    }
    case Actions.DOCKER_PULL_STREAM: {
      const {id, info: {stream}} = action;
      return ({
        ...state, dockerPullStream: {
          ...state.dockerPullStream, [id]: [
            ...(state.dockerPullStream[id] || []),
            stream
          ]
        }
      })
    }
    case Actions.DOCKER_PULL_COMPLETED: {
      const {dockerPullInfo, dockerPullStream} = state;
      return ({
        ...state,
        dockerPullInfo: Object.keys(dockerPullInfo)
          .filter(k => k !== action.id)
          .reduce((dpiNew, k) => ({...dpiNew, [k]: dockerPullInfo[k]}), {}),
        dockerPullStream: Object.keys(dockerPullStream)
          .filter(k => k !== action.id)
          .reduce((dpsNew, k) => ({...dpsNew, [k]: dockerPullInfo[k]}), {})
      })
    }
    default:
      return state
  }
}

