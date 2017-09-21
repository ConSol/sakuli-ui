import {Action} from "@ngrx/store";
import {TestSuite} from "../../../sweetest-components/services/access/model/test-suite.model";
import {Name} from "../../../core/redux.util";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {SocketEvent} from "../../../sweetest-components/services/access/model/socket-event.interface";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";



export const LOAD_TESTSUITE = Name('loadtestsuite');
export class LoadTestsuite implements Action {
  readonly type = LOAD_TESTSUITE;
}

export const SET_TESTSUITE = Name('settestsuite');
export class SetTestSuite implements Action {
  readonly type = SET_TESTSUITE;
  constructor(
    readonly testSuite: TestSuite
  ) {}
}

export const OPEN_TEST = Name('opentest');
export class OpenTest implements Action {
  readonly type = OPEN_TEST;
  constructor(
    readonly testCase: string
  ) {}
}

export const CLOSE_TEST = Name('closetest');
export class CloseTest implements Action {
  readonly type = CLOSE_TEST;
  constructor(
    readonly testCase: string
  ) {}
}

export const RUN_TEST = Name('runtest');
export class RunTest implements Action {
  readonly type = RUN_TEST;
  constructor(
    readonly testSuite: SakuliTestSuite
  ) {}
}

export const SET_TEST_RUN_INFO = Name('settestruninfo');
export class SetTestRunInfo implements Action {
  readonly type = SET_TEST_RUN_INFO;
  constructor(
    readonly testRunInfo: TestRunInfo,
    readonly testSuite?: TestSuite
  ) {}
}

export const APPEND_TEST_RUN_INFO_LOG = Name('appendtestruninfolog');
export class AppendTestRunInfoLog implements Action {
  readonly type = APPEND_TEST_RUN_INFO_LOG;
  constructor(
    readonly socketEvent: SocketEvent
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

export type AllTypes = LoadTestsuite
  | SetTestSuite
  | CloseTest
  | OpenTest
  | RunTest
  | SetTestRunInfo
  | AppendTestRunInfoLog
  | ClearLog
  | LoadTestResults
  | LoadTestResultsSuccess;
