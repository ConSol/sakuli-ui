import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {project} from "../../project/state/project.interface";
import {nothrow} from "nothrow";
import {nothrowFn} from "../../../core/utils";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";

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
  testRunInfo: TestRunInfo | null;
  testRunInfoLogs: { [id: string]: LogMessage[] }
  testResults: TestSuiteResult[],
  dockerPullInfo: DockerPullInfoMap,
  dockerPullStream: IdMap<string[]>
};

export const TestStateInit: TestState = {
  testSuite: null,
  openTests: [],
  activeTest: null,
  testRunInfo: null,
  testRunInfoLogs: {},
  testResults: [],
  dockerPullInfo: {},
  dockerPullStream: {}
};

export const testState = createFeatureSelector<TestState>('test');

export const openTests = createSelector(testState, s => s ? s.openTests : []);
export const activeTest = createSelector(testState, s => nothrow(() => s.activeTest) || null);

export const testCase = createSelector(
  activeTest,
  project,
  (at, p) => nothrow(() => p.testSuite.testCases.filter(t => t.name === at).find((_, i) => i === 0)) || null
);

export const allTestCases = createSelector(
  project,
  p => {
    const {path} = p;
    return nothrow(() => p.testSuite.testCases.reduce((cases, tc) => [...tc.sourceFiles.map(src => src.replace(`${path}/`, ''))], []));
  }
);

export const runInfo = createSelector(testState, nothrowFn((s) => s.testRunInfo));

export const dockerPullInfo = createSelector(testState, nothrowFn((s) => s.dockerPullInfo));
export const dockerPullStream = createSelector(testState, nothrowFn((s) => s.dockerPullStream));

export const dockerPullInfoForCurrentRunInfo = createSelector(
  runInfo,
  dockerPullInfo,
  nothrowFn((tri: TestRunInfo, dpi: DockerPullInfoMap) => dpi[tri.containerId])
);

export const dockerPullInfoForCurrentRunInfoAsArray = createSelector(
  dockerPullInfoForCurrentRunInfo,
  nothrowFn(dockerPullInfoMap => Object.keys(dockerPullInfoMap).reduce((l, d) => ([...l, dockerPullInfoMap[d]]), []))
);

export const dockerPullStreamForCurrentRunInfo = createSelector(
  runInfo,
  dockerPullStream,
  nothrowFn((tri: TestRunInfo, dpi: IdMap<string[]>) => dpi[tri.containerId])
);

export const testRunLogs = createSelector(
  testState,
  nothrowFn(t => t.testRunInfoLogs)
);

export const logsForCurrentRunInfo = createSelector(
  testRunLogs,
  runInfo,
  nothrowFn((trl: { [id: string]: LogMessage[] }, tri: TestRunInfo) => trl[tri.containerId], [])
);

export const testResults = createSelector(
  testState,
  nothrowFn(ts => ts.testResults, [])
)
