import {WorkspaceState, WorkspaceStateInit} from "./workspace/state/project.interface";
import {TestState, TestStateInit} from "./test/state/test.interface";
import {
  ToastAppState,
  ToastStateInit
} from "../sweetest-components/components/presentation/toast/toast-state.interface";
import {AssetsState, AssetsStateInit} from "./test/sa-assets/sa-assets.interface";
import {testEditorEntityAdapter, TestEditorState, testEditorStateInit} from "./test/state/test-editor.interface";

export interface AppStateBase {
  project: WorkspaceState,
  test: TestState,
  assets: AssetsState,
  testEditor: TestEditorState
}

export type AppState = AppStateBase & ToastAppState;

export function initStateFactory() {
  return (JSON.parse(sessionStorage.getItem('sakuli-admin-state')) as AppState) || ({
    project: WorkspaceStateInit,
    test: TestStateInit,
    assets: AssetsStateInit,
    scToast: ToastStateInit,
    testEditor: testEditorStateInit
  });
}
