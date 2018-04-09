import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {absPath, FileResponse} from "../../../services/access/model/file-response.interface";
import {Action, createFeatureSelector, createSelector, MemoizedSelector} from "@ngrx/store";
import {FileSelectorSort} from "./file-selector-filter.interface";
import * as _ from 'lodash';
export const FileSelectorFeatureName = 'scFileSelector';

export interface FileSelectorFile extends FileResponse {
  open: boolean
  selected: boolean;
  loading: boolean;
}

export const fileSelectorSelectId = (e: FileSelectorFile): string => absPath(e);

export interface FileSelectorState extends EntityState<FileSelectorFile> {
  open: boolean;
}

export const FileSelectorFileFromFileResponse = (fr: FileResponse): FileSelectorFile => {
  return ({
    ...fr,
    open: false,
    selected: false,
    loading: false
  })
};

export const fileSelectorEntityAdapter = createEntityAdapter<FileSelectorFile>({
  selectId: fileSelectorSelectId,
  sortComparer: (f: FileSelectorFile) => f.name
});

export const fileSelectorStateInit = fileSelectorEntityAdapter.getInitialState({
  open: false
});

const featureSelector = createFeatureSelector<FileSelectorState>(FileSelectorFeatureName);

export const DEFAULT_FILESELECTORFILE_SORT: FileSelectorSort = [
  f => f.directory ? 0 : 1,
  f => f.name
];

const _fileSelectorSelectors = fileSelectorEntityAdapter.getSelectors(featureSelector);
export const fileSelectorSelectors = {
  ..._fileSelectorSelectors,
  childrenFor(path: string, sort: FileSelectorSort = DEFAULT_FILESELECTORFILE_SORT) {
    return createSelector(_fileSelectorSelectors.selectAll,
      files => _.sortBy<FileSelectorFile>(files.filter(file => file.path === path), sort)
    )
  },
  selectedFiles: createSelector(_fileSelectorSelectors.selectAll,
    files => files.filter(f => f.selected)
  )
};

export const OPEN_FILESELECTORFILE = '[FILESELECTORFILE] OPEN';

export class OpenFileSelectorFile implements Action {
  readonly type = OPEN_FILESELECTORFILE;

  constructor(readonly id: string) {
  }
}

export const CLOSE_FILESELECTORFILE = '[FILESELECTORFILE] CLOSE';

export class CloseFileselectorfile implements Action {
  readonly type = CLOSE_FILESELECTORFILE;

  constructor(readonly id: string) {
  }
}

export const ADD_FILESELECTORFILES = '[FILESELECTORFILES] ADD';

export class AddFileSelectorFiles implements Action {
  readonly type = ADD_FILESELECTORFILES;

  constructor(readonly files: FileSelectorFile[]) {
  }
}

export const OPEN_FILESELECTOR = '[FILESELECTOR] OPEN';

export class OpenFileSelector implements Action {
  readonly type = OPEN_FILESELECTOR;

  constructor() {
  }
}

export const CLOSE_FILESELECTOR = '[FILESELECTOR] CLOSE';

export class CloseFileselector implements Action {
  readonly type = CLOSE_FILESELECTOR;

  constructor() {
  }
}

export const SELECT_FILESELECTORFILE = '[FILESELECTORFILE] SELECT';

export class SelectFileselectorfile implements Action {
  readonly type = SELECT_FILESELECTORFILE;

  constructor(readonly id: string) {
  }
}

export type FileSelectorActions = AddFileSelectorFiles
  | OpenFileSelectorFile
  | OpenFileSelector
  | CloseFileselector
  | CloseFileselectorfile
  | SelectFileselectorfile
  ;

const addOrUpdate = (state: FileSelectorState, entities: FileSelectorFile[]): FileSelectorState => {
  const {ids} = state;
  const added = (entities as FileSelectorFile[])
    .filter(e => (ids as string[]).indexOf(fileSelectorSelectId(e)) < 0);
  return fileSelectorEntityAdapter.addMany(
    added,
    state
  );
};

export function fileSelectorReducer(state: FileSelectorState = fileSelectorStateInit, action: FileSelectorActions) {
  //console.log(action.type, state);
  //console.trace('TRaced');
  const res = (() => {

    switch (action.type) {
      case OPEN_FILESELECTOR: {
        return ({...state, open: true})
      }
      case CLOSE_FILESELECTOR: {
        return ({...state, open: false})
      }
      case ADD_FILESELECTORFILES: {
        return addOrUpdate(state, action.files);
      }
      case OPEN_FILESELECTORFILE: {
        const {id} = action;
        return fileSelectorEntityAdapter.updateOne({id, changes: {open: true}}, state);
      }
      case CLOSE_FILESELECTORFILE: {
        const {id} = action;
        return fileSelectorEntityAdapter.updateOne({id, changes: {open: false}}, state);
      }
      case SELECT_FILESELECTORFILE: {
        const {id} = action;
        const resetState = fileSelectorEntityAdapter.updateMany((state.ids as string[]).map((id: string) => ({
          id,
          changes: {selected: false}
        })), state);
        return fileSelectorEntityAdapter.updateOne({id, changes: {selected: true}}, resetState);
      }
    }
    return state || fileSelectorStateInit
  })();
  //console.log(state);
  return res;
}
