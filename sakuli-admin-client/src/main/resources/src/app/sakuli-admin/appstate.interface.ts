import {WorkspaceState, WorkspaceStateInit} from "./workspace/state/project.interface";
import {TestState, TestStateInit} from "./test/state/test.interface";
import {
  ToastAppState,
  ToastStateInit
} from "../sweetest-components/components/presentation/toast/toast-state.interface";
import {AssetsState, AssetsStateInit} from "./test/sa-assets/sa-assets.interface";
import {TestEditorState, testEditorStateInit} from "./test/state/test-editor.interface";
import {TestSuiteState, testSuiteStateInit} from "./test/state/testsuite.state";
import {ScLoadingState} from "../sweetest-components/components/presentation/loading/sc-loading.state";
import {MenuState, menuStateInit} from "../sweetest-components/components/layout/menu/menu.state";
import {AuthFeatureName} from "../sweetest-components/services/access/auth/auth.state";

export interface AppStateBase {
  project: WorkspaceState,
  test: TestState,
  assets: AssetsState,
  testEditor: TestEditorState,
  testsuite: TestSuiteState,
  scLoading: ScLoadingState,
  scMenu: MenuState,

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
  scMenu: menuStateInit
};

export function initStateFactory() {

  const dehydrationProps: string[] = [
    'project',
    'test',
    'assets',
    'testsuite',
    'testEditor',
    'scMenu',
    AuthFeatureName
    //TestExecutionLogFeatureName,
    //TestExecutionFeatureName
  ];
  const state = JSON.parse(sessionStorage.getItem('sakuli-admin-state')) || {} as AppState;

  return dehydrationProps.reduce((s, k) => ({...s, [k]: state[k]}), stateInit);
}
