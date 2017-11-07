import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {Tree, TreeItem} from "../../../sweetest-components/components/presentation/tree/tree.interface";
import {ProjectModel} from "../../../sweetest-components/services/access/model/project.model";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {nothrow} from "nothrow";

export interface ProjectState {
  fileTree: Tree<FileResponse>[],
  selectedFile: Tree<FileResponse> | null,
  project: ProjectModel | null
}

export const ProjectStateInit: ProjectState = {
  fileTree: [],
  selectedFile: null,
  project: null
}


export const projectState = createFeatureSelector<ProjectState>('project');

export const project = createSelector(projectState, s => nothrow(() => s.project) || null);

export const testCases = createSelector(projectState, s=> nothrow(() => s.project.testSuite.testCases) || [])


export const projectFileRoot = createSelector(
  project,
  project => nothrow(() =>`api/files/${project.path}`) || 'api/files'
);
