import {createFeatureSelector, createSelector} from "@ngrx/store";
import {nothrow} from "nothrow";
import {AssetItemType, getItemType} from "./asset-item-type.enum";
import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {project} from "../../project/state/project.interface";

export const ASSETS_FEATURE_NAME = 'assets';

export interface AssetsState {
  files: FileResponse[];
  currentFolder: string | null;
  uploading:string[],
  selectedFile: string | null;
}
export const AssetsStateInit: AssetsState = {
  files: [],
  currentFolder: null,
  uploading: [],
  selectedFile: null
};

export const assets = createFeatureSelector<AssetsState>(ASSETS_FEATURE_NAME);

export const currentFolderWithProjectPath = createSelector(assets, a => nothrow(() => a.currentFolder)  || AssetsStateInit.currentFolder)

export const currentFolder = createSelector(
  assets,
  project,
  (assets, project) => nothrow(() => assets.currentFolder.replace(project.path, '')) || AssetsStateInit.currentFolder);

export const files = createSelector(assets, s => s ? s.files : AssetsStateInit.files);

export const currentChildren = createSelector(
  currentFolder,
  files,
  project,
  (cf, fl, project) => {
    return fl
      .filter(f => `${project.path}${cf || ''}` === f.path)
      .map(f => ({...f, path: f.path.replace(project.path, '')}));
  }
);

export const currentChildrenBy = (filter: (f:FileResponse) => boolean) => createSelector(
  currentChildren,
  c => c.filter(filter)
)

export const uploading = createSelector(assets, a => nothrow(() => a.uploading) || []);

export const selectedFile = createSelector(assets, a => nothrow(() => a.selectedFile) || null);

export const currentChildrenImages = currentChildrenBy(
  (c: FileResponse) => getItemType(c) === AssetItemType.Image
);
