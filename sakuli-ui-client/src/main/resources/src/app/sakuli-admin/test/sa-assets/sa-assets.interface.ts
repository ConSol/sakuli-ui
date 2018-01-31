import {createFeatureSelector, createSelector} from "@ngrx/store";
import {nothrow} from "nothrow";
import {AssetItemType, getItemType} from "./asset-item-type.enum";
import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";

export const ASSETS_FEATURE_NAME = 'assets';

export interface PinnedAssetFile {
  file: FileResponse,
  context: string
}

export interface AssetsState {
  files: FileResponse[];
  currentFolder: string | null;
  basePath: string | null;
  uploading:string[],
  selectedFile: string | null;
  pinned: PinnedAssetFile[]
}
export const AssetsStateInit: AssetsState = {
  files: [],
  currentFolder: null,
  basePath: '',
  uploading: [],
  selectedFile: null,
  pinned: []
};

export const assets = createFeatureSelector<AssetsState>(ASSETS_FEATURE_NAME);

export const currentFolderWithProjectPath = createSelector(assets, a => nothrow(() => a.currentFolder)  || AssetsStateInit.currentFolder)

export const assetBasePath = createSelector(
  assets,
  s => s.basePath
)

export const currentFolder = createSelector(
  assets,
  (s) => nothrow(() => {
    return [s.basePath, s.currentFolder].filter(p => !!p).map((s, i) => {
      const leading = (i != 0) ? `^[/]+|` : ``;
      const trailing = `[/]+$`;
      const regEx = RegExp(`${leading}${trailing}`, "g");
      return s.replace(regEx, '');
    }).join('/')
  }));

export const files = createSelector(assets, s => s ? s.files : AssetsStateInit.files);

export const currentChildren = createSelector(
  currentFolder,
  files,
  assetBasePath,
  (cf, fl, bp) => {
    const res = fl
      .filter(f => `${cf || ''}` === f.path)
      .map(f => ({...f, path: f.path.replace(bp, '')}));
    console.log(res);
    return res;
  }
);

export const currentChildrenBy = (filter: (f:FileResponse) => boolean) => createSelector(
  currentChildren,
  c => c.filter(filter)
);

export const pinnedByContext = (context: string) => createSelector(
  assets,
  a => a.pinned.filter(p => p.context === context)
);

export const uploading = createSelector(assets, a => nothrow(() => a.uploading) || []);

export const selectedFile = createSelector(assets, a => nothrow(() => a.selectedFile) || null);

export const currentChildrenImages = currentChildrenBy(
  (c: FileResponse) => getItemType(c) === AssetItemType.Image
);
