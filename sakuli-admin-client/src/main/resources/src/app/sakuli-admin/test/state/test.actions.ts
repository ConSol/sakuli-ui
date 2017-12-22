import {Action} from "@ngrx/store";
import {uniqueName} from "../../../core/redux.util";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {TestExecutionEvent} from "../../../sweetest-components/services/access/model/test-execution-event.interface";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DockerPullInfo} from "./test.interface";
import {CloseTest, OpenTest} from "./test-editor.interface";

export const LOAD_TESTRESULTS = uniqueName('[test] LOAD_TESTRESULTS');
export class LoadTestResults implements Action {
  readonly type = LOAD_TESTRESULTS;
  constructor() {}
}

export const LOAD_TESTRESULTS_SUCCESS = uniqueName('[test] LOAD_TESTRESULTS_SUCCESS');
export class LoadTestResultsSuccess implements Action {
  readonly type = LOAD_TESTRESULTS_SUCCESS;
  constructor(
    readonly results: TestSuiteResult[]
  ) {}
}

export const DOCKER_PULL_STARTED = '[test] DOCKER_PULL_STARTED';
export class DockerPullStarted implements Action {
  readonly type = DOCKER_PULL_STARTED;
  constructor(
    readonly id: string
  ) {}
}

export const DOCKER_PULL_PROGRESS = '[test] DOCKER_PULL_PROGRESS';
export class DockerPullProgress implements Action {
  readonly type = DOCKER_PULL_PROGRESS;
  constructor(
    readonly id: string,
    readonly info: DockerPullInfo
  ) {}
}

export const DOCKER_PULL_STREAM = '[test] DOCKER_PULL_STREAM';
export class DockerPullStream implements Action {
  readonly type = DOCKER_PULL_STREAM;
  constructor(
    readonly id: string,
    readonly info: DockerPullInfo
  ) {}
}

export const DOCKER_PULL_PROGRESS_BATCH = '[test] DOCKER_PULL_PROGRESS_BATCH';
export class DockerPullProgressBatch implements Action {
  readonly type = DOCKER_PULL_PROGRESS_BATCH;
  constructor(
    readonly actions: DockerPullProgress[]
  ) {}
}

export const DOCKER_PULL_COMPLETED = '[test] DOCKER_PULL_COMPLETED';
export class DockerPullCompleted implements Action {
  readonly type = DOCKER_PULL_COMPLETED;
  constructor(
    readonly id: string
  ) {}
}

export type AllTypes =
  | OpenTest
  | CloseTest
  | LoadTestResults
  | LoadTestResultsSuccess
  | DockerPullStarted
  | DockerPullProgress
  | DockerPullStream
  | DockerPullCompleted
  | DockerPullProgressBatch;
