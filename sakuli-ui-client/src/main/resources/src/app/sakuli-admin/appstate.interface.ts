import {WorkspaceFeatureName, WorkspaceState, WorkspaceStateInit} from "./workspace/state/project.interface";
import {TestState, TestStateInit} from "./test/state/test.interface";
import {
  ToastAppState,
  ToastStateInit
} from "../sweetest-components/components/presentation/toast/toast-state.interface";
import {ASSETS_FEATURE_NAME, AssetsState, AssetsStateInit} from "./test/sa-assets/sa-assets.interface";
import {TestEditorFeatureName, TestEditorState, testEditorStateInit} from "./test/state/test-editor.interface";
import {TestSuiteFeatureName, TestSuiteState, testSuiteStateInit} from "./test/state/testsuite.state";
import {ScLoadingState} from "../sweetest-components/components/presentation/loading/sc-loading.state";
import {MenuState, menuStateInit, ScMenuFeatureName} from "../sweetest-components/components/layout/menu/menu.state";
import {AuthFeatureName} from "../sweetest-components/services/access/auth/auth.state";
import {
  FileSelectorState,
  fileSelectorStateInit
} from "../sweetest-components/components/presentation/file-selector/file-selector.state";
import {TestExecutionState, testExecutionStateInit} from "./test/state/testexecution.state";
import {TestExecutionLogState, testExecutionLogStateInit} from "./test/state/test-execution-log.state";

export interface AppStateBase {
  project: WorkspaceState,
  test: TestState,
  assets: AssetsState,
  testEditor: TestEditorState,
  testsuite: TestSuiteState,
  scLoading: ScLoadingState,
  scMenu: MenuState,
  scFileSelector: FileSelectorState,
  testexecution: TestExecutionState,
  testexecutionlog: TestExecutionLogState
}

export type AppState = AppStateBase & ToastAppState;

export const stateInit: AppState = {
  project: WorkspaceStateInit,
  test: TestStateInit,
  assets: AssetsStateInit,
  scToast: ToastStateInit,
  testEditor: testEditorStateInit,
  testsuite: testSuiteStateInit,
  scLoading: {},
  scMenu: menuStateInit,
  scFileSelector: fileSelectorStateInit,
  testexecution: testExecutionStateInit,
  testexecutionlog: testExecutionLogStateInit

};

export function initStateFactory(): any {

  const dehydrationProps: string[] = [
    WorkspaceFeatureName,
    'test',
    ASSETS_FEATURE_NAME,
    TestSuiteFeatureName,
    TestEditorFeatureName,
    ScMenuFeatureName,
    AuthFeatureName
    //TestExecutionLogFeatureName,
    //TestExecutionFeatureName
  ];
  const state = JSON.parse(sessionStorage.getItem('sakuli-admin-state') || '{}') || {} as AppState;
  return dehydrationProps.reduce((s, k) => ({...s, [k]: state[k]}), stateInit);
}
