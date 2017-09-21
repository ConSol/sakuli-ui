import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {project} from "../../project/state/project.interface";
import {nothrow} from "nothrow";
import {TestSuite} from "../../../sweetest-components/services/access/model/test-suite.model";

export interface TestState {
  testSuite: TestSuite | null;
  openTests: string[];
  activeTest: string | null;
  testRunInfo: TestRunInfo | null;
  testRunInfoLogs: {[id:string]:string[]}
  testResults: TestSuiteResult[]
};

export const TestStateInit: TestState = {
  testSuite: null,
  openTests: [],
  activeTest: null,
  testRunInfo: null,
  testRunInfoLogs: {},
  testResults: []
};

export const testState = createFeatureSelector<TestState>('test');

export const openTests = createSelector(testState, s => s ? s.openTests : []);
export const activeTest = createSelector(testState, s => nothrow(() => s.activeTest) || null);

export const testCase = createSelector(
  activeTest,
  project,
  (at, p) => nothrow(() => p.testSuite.testCases.filter(t => t.name === at).find((_,i) => i===0)) || null
);

export const allTestCases = createSelector(
  project,
  p => {
    const {path} = p;
    return nothrow(() => p.testSuite.testCases.reduce((cases, tc) => [...tc.sourceFiles.map(src => src.replace(`${path}/`, ''))], []));
  }
)
