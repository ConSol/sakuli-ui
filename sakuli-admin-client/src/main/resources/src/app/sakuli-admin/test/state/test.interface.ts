import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {project} from "../../project/state/project.interface";
import {nothrow} from "nothrow";
import {TestSuite} from "../../../sweetest-components/services/access/model/test-suite.model";
import {nothrowFn} from "../../../core/utils";

export interface DockerPullInfoProgressDetail {
  current: number;
  total: number;
}

export interface DockerPullInfo {
  status: string;
  progressDetail: DockerPullInfoProgressDetail;
  progress: string;
  id: string;
}

export type IdMap<T> = {[id: string]: T};
export type DockerPullInfoMap = IdMap<IdMap<DockerPullInfo>>;

export interface TestState {
  testSuite: TestSuite | null;
  openTests: string[];
  activeTest: string | null;
  testRunInfo: TestRunInfo | null;
  testRunInfoLogs: { [id: string]: string[] }
  testResults: TestSuiteResult[],
  dockerPullInfo: DockerPullInfoMap
};

export const TestStateInit: TestState = {
  testSuite: null,
  openTests: [],
  activeTest: null,
  testRunInfo: null,
  testRunInfoLogs: {},
  testResults: [],
  dockerPullInfo: {}
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

export const dockerPullInfoForCurrentRunInfo = createSelector(
  runInfo,
  dockerPullInfo,
  nothrowFn((tri: TestRunInfo, dpi: DockerPullInfoMap) => dpi[tri.containerId])
);

export const dockerPullInfoForCurrentRunInfoAsArray = createSelector(
  dockerPullInfoForCurrentRunInfo,
  nothrowFn(dockerPullInfoMap => Object.keys(dockerPullInfoMap).reduce((l, d) => ([...l, dockerPullInfoMap[d]]), []))
)
