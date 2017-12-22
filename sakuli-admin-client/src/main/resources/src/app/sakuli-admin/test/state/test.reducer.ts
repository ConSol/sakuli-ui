import {DockerPullInfo, TestState, TestStateInit} from './test.interface';
import * as Actions from './test.actions';

export function testReducer(state: TestState = TestStateInit, action: Actions.AllTypes): TestState {
  switch (action.type) {
    case Actions.LOAD_TESTRESULTS_SUCCESS: {
      return ({...state, testResults: action.results})
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
    case Actions.DOCKER_PULL_PROGRESS_BATCH: {
      return action.actions.reduce(testReducer, state);
    }
    default:
      return state
  }
}

