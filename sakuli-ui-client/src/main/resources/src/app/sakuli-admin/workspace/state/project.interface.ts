import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {Tree} from "../../../sweetest-components/components/presentation/tree/tree.interface";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export const WorkspaceFeatureName = 'project';

export interface WorkspaceState {
  fileTree: Tree<FileResponse>[],
  selectedFile: Tree<FileResponse> | null,
  workspace: string | null,
}

export const WorkspaceStateInit: WorkspaceState = {
  fileTree: [],
  selectedFile: null,
  workspace: ''
};

const workspaceState = createFeatureSelector<WorkspaceState>(WorkspaceFeatureName);
const workspace = createSelector(
  workspaceState,
  (s) => s ? s.workspace :  ''
)

export const workspaceSelectors = {
  workspaceState,
  workspace
}
