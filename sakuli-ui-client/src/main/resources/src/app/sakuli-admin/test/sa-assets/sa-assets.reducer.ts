import {AssetsState, AssetsStateInit} from "./sa-assets.interface";
import {
  ASSETS_CLOSE_FILE,
  ASSETS_DELETE_SUCCESS,
  ASSETS_LOAD_FOLDER_SUCCESS,
  ASSETS_OPEN_FILE,
  ASSETS_PIN,
  ASSETS_SET_CURRENT_FOLDER,
  ASSETS_UNPIN,
  ASSETS_UPLOAD,
  ASSETS_UPLOAD_ERROR,
  ASSETS_UPLOAD_SUCCESS,
  AssetsActions,
  AssetsPin,
  AssetsUnpin
} from "./sa-assets.action";
import {uniq} from "../../../core/utils";
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import * as update from 'immutability-helper';

function getIndex(state:AssetsState, action: AssetsPin | AssetsUnpin) {
  return state.pinned.findIndex(p => p.context === action.context && absPath(p.file) === absPath(action.file))
}

export function assetReducer(state:AssetsState = AssetsStateInit, action:AssetsActions) {
  switch (action.type) {
    case ASSETS_LOAD_FOLDER_SUCCESS: {
      const {children, parent} = action;
      return ({
        ...state,
        files: uniq([...children, ...state.files], f => absPath(f)),
      });
    }
    case ASSETS_SET_CURRENT_FOLDER: {
      const {folder: currentFolder, basePath} = action;
      return ({...state, currentFolder, basePath});
    }
    case ASSETS_UPLOAD: {
      const {files} = action;
      return ({...state, uploading: files.map(f => f.name)})
    }
    case ASSETS_UPLOAD_SUCCESS: {
      const {file} = action;
      return ({...state, uploading: state.uploading.filter(u => u !== file.name)})
    }
    case ASSETS_UPLOAD_ERROR: {
      const {file} = action;
      return ({...state, uploading: state.uploading.filter(u => u !== file.name)})
    }
    case ASSETS_DELETE_SUCCESS: {
      const {file} = action;
      return ({...state, files: state.files.filter(f => absPath(f) === absPath(file))});
    }
    case ASSETS_OPEN_FILE: {
      const {file} = action;
      return ({...state, selectedFile: file});
    }
    case ASSETS_CLOSE_FILE: {
      return ({...state, selectedFile: null});
    }
    case ASSETS_PIN: {
      const index = getIndex(state, action);
      return index < 0 ? update(state, {pinned: {$push: [action]}}) : state;
    }
    case ASSETS_UNPIN: {
      const index = getIndex(state, action);
      return update(state, {pinned: {$splice:[[index, 1]]}})
    }
  }

  return state || AssetsStateInit;
}
