import {Action} from "@ngrx/store";
import {TestSuite} from "../../../sweetest-components/services/access/model/test-suite.model";
import {Name} from "../../../core/redux.util";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {TestExecutionEvent} from "../../../sweetest-components/services/access/model/test-execution-event.interface";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {DockerPullInfo} from "./test.interface";



export const LOAD_TESTSUITE = Name('[test] loadtestsuite');
export class LoadTestsuite implements Action {
  readonly type = LOAD_TESTSUITE;
}

export const SET_TESTSUITE = Name('[test] settestsuite');
export class SetTestSuite implements Action {
  readonly type = SET_TESTSUITE;
  constructor(
    readonly testSuite: TestSuite
  ) {}
}

export const OPEN_TEST = Name('[test] opentest');
export class OpenTest implements Action {
  readonly type = OPEN_TEST;
  constructor(
    readonly testCase: string
  ) {}
}

export const CLOSE_TEST = Name('[test] closetest');
export class CloseTest implements Action {
  readonly type = CLOSE_TEST;
  constructor(
    readonly testCase: string
  ) {}
}

export const RUN_TEST = Name('[test] runtest');
export class RunTest implements Action {
  readonly type = RUN_TEST;
  constructor(
    readonly testSuite: SakuliTestSuite
  ) {}
}

export const SET_TEST_RUN_INFO = Name('[test] settestruninfo');
export class SetTestRunInfo implements Action {
  readonly type = SET_TEST_RUN_INFO;
  constructor(
    readonly testRunInfo: TestRunInfo,
    readonly testSuite?: TestSuite
  ) {}
}

export const APPEND_TEST_RUN_INFO_LOG = Name('[test] appendtestruninfolog');
export class AppendTestRunInfoLog implements Action {
  readonly type = APPEND_TEST_RUN_INFO_LOG;
  constructor(
    readonly testExecutionEvent: TestExecutionEvent
  ) {}
}

export const CLEAR_LOG = '[test] CLEAR_LOG';
export class ClearLog implements Action {
  readonly type = CLEAR_LOG;
  constructor() {}
}

export const LOAD_TESTRESULTS = Name('[test] LOAD_TESTRESULTS');
export class LoadTestResults implements Action {
  readonly type = LOAD_TESTRESULTS;
  constructor() {}
}

export const LOAD_TESTRESULTS_SUCCESS = Name('[test] LOAD_TESTRESULTS_SUCCESS');
export class LoadTestResultsSuccess implements Action {
  readonly type = LOAD_TESTRESULTS_SUCCESS;
  constructor(
    readonly results: TestSuiteResult[]
  ) {}
}

export const TEST_EXECUTION_STARTED = Name('[test] TEST_EXECUTION_STARTED');
export class TestExecutionStarted implements Action {
  readonly type = TEST_EXECUTION_STARTED
  constructor(
    readonly id: string
  ) {}
}

export const TEST_EXECUTION_COMPLETED = '[test] TEST_EXECUTION_COMPLETED';
export class TestExecutionCompleted implements Action {
  readonly type = TEST_EXECUTION_COMPLETED;
  constructor(
    readonly id: string
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

export const DOCKER_PULL_COMPLETED = '[test] DOCKER_PULL_COMPLETED';
export class DockerPullCompleted implements Action {
  readonly type = DOCKER_PULL_COMPLETED;
  constructor(
    readonly id: string
  ) {}
}

export type AllTypes = LoadTestsuite
  | SetTestSuite
  | CloseTest
  | OpenTest
  | RunTest
  | SetTestRunInfo
  | AppendTestRunInfoLog
  | ClearLog
  | LoadTestResults
  | LoadTestResultsSuccess
  | TestExecutionCompleted
  | TestExecutionStarted
  | DockerPullStarted
  | DockerPullProgress
  | DockerPullCompleted;
