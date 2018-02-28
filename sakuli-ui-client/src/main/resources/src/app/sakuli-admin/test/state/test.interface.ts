import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {nothrow} from "nothrow";
import {nothrowFn} from "../../../core/utils";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestExecutionEntity, testExecutionSelectors} from "./testexecution.state";

export interface DockerPullInfoProgressDetail {
  current: number;
  total: number;
}

export interface DockerPullInfo {
  stream: string;
  status: string;
  progressDetail: DockerPullInfoProgressDetail;
  progress: string;
  id: string;
}

export type IdMap<T> = {[id: string]: T};
export type DockerPullInfoMap = IdMap<IdMap<DockerPullInfo>>;

export type LogMessage = string;

export interface TestState {
  testSuite: SakuliTestSuite | null;
  openTests: string[];
  activeTest: string | null;
  testResults: TestSuiteResult[],
  dockerPullInfo: DockerPullInfoMap,
  dockerPullStream: IdMap<string[]>
};

export const TestStateInit: TestState = {
  testSuite: null,
  openTests: [],
  activeTest: null,
  testResults: [],
  dockerPullInfo: {},
  dockerPullStream: {}
};

export const testState = createFeatureSelector<TestState>('test');

export const openTests = createSelector(testState, s => s ? s.openTests : []);
export const activeTest = createSelector(testState, s => nothrow(() => s.activeTest) || null);

export const dockerPullInfo = createSelector(testState, nothrowFn((s) => s.dockerPullInfo));
export const dockerPullStream = createSelector(testState, nothrowFn((s) => s.dockerPullStream));

export function dockerPullInfoForCurrentRunInfo (testSuite: SakuliTestSuite) {
  return createSelector(
    testExecutionSelectors.latestByTestSuite(testSuite),
    dockerPullInfo,
    nothrowFn((tri: TestExecutionEntity, dpi: DockerPullInfoMap) => dpi[tri.containerId])
  );
}

export function dockerPullInfoForCurrentRunInfoAsArray(testSuite: SakuliTestSuite) {
  return createSelector(
    dockerPullInfoForCurrentRunInfo(testSuite),
    nothrowFn(dockerPullInfoMap => Object.keys(dockerPullInfoMap).reduce((l, d) => ([...l, dockerPullInfoMap[d]]), []))
  );
}

export function dockerPullStreamForCurrentRunInfo (testSuite: SakuliTestSuite) {
  return createSelector(
    testExecutionSelectors.latestByTestSuite(testSuite),
    dockerPullStream,
    nothrowFn((tri: TestRunInfo, dpi: IdMap<string[]>) => dpi[tri.containerId])
  );
}

export const testResults = createSelector(
  testState,
  nothrowFn(ts => ts.testResults, [])
);

export const testResultsFor = (testSuite: SakuliTestSuite) => {
  return createSelector(
    testResults,
    nothrowFn((results: TestSuiteResult[]) => results
      .filter(r =>  r.id === testSuite.id)
    )
  );
}

export const testSelectors = {
  testState,
  openTests,
  activeTest,
  dockerPullInfo,
  dockerPullStream,
  dockerPullStreamForCurrentRunInfo,
  dockerPullInfoForCurrentRunInfoAsArray,
  testResults,
  testResultsFor
}
