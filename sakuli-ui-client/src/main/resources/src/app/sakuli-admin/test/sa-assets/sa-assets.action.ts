import {Action} from "@ngrx/store";
import {uniqueName} from "../../../core/redux.util";
import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";

export const ASSETS_LOAD_FOLDER = uniqueName('[asset] LOAD_FOLDER');
export class AssetLoadFolder implements Action {
  readonly type = ASSETS_LOAD_FOLDER;
  constructor(
    readonly folder: string
  ) {}
}


export const ASSETS_LOAD_FOLDER_SUCCESS = '[asset] ASSETS_LOAD_FOLDER_SUCCESS';
export class AssetLoadFolderSuccess implements Action {
  readonly type = ASSETS_LOAD_FOLDER_SUCCESS;
  constructor(
    readonly parent: string,
    readonly children: FileResponse[]
  ) {}
}

export const ASSETS_SET_CURRENT_FOLDER = '[asset] ASSETS_SET_CURRENT_FOLDER';
export class AssetsSetCurrentFolder implements Action {
  readonly type = ASSETS_SET_CURRENT_FOLDER;
  constructor(
    readonly folder: string,
    readonly basePath: string
  ) {}

  get fullPath() {
    return `${this.basePath}/${this.folder}`;
  }
}

export const ASSETS_UPLOAD = '[asset] ASSETS_UPLOAD';
export class AssetsUpload implements Action {
  readonly type = ASSETS_UPLOAD;
  constructor(
    private _files: FileList,
    readonly targetFolder: string,
  ) {}

  get files() {
    return Array.from(this._files);
  }
}

export const ASSETS_UPLOAD_SUCCESS = '[asset] ASSETS_UPLOAD_SUCCESS';
export class AssetsUploadSuccess implements Action {
  readonly type = ASSETS_UPLOAD_SUCCESS;
  constructor(
    readonly file: File,
  ) {}
}

export const ASSETS_UPLOAD_ERROR = '[asset] ASSETS_UPLOAD_ERROR';
export class AssetsUploadError implements Action {
  readonly type = ASSETS_UPLOAD_ERROR;
  constructor(
    readonly file: File,
    readonly message: string,
  ) {}
}

export const ASSETS_DELETE = '[asset] ASSETS_DELETE';
export class AssetsDelete implements Action {
  readonly type = ASSETS_DELETE;
  constructor(
    readonly file: FileResponse
  ) {}
}

export const ASSETS_DELETE_SUCCESS = '[assets] ASSETS_DELETE_SUCCESS';
export class AssetsDeleteSuccess implements Action {
  readonly type = ASSETS_DELETE_SUCCESS;
  constructor(
    readonly file: FileResponse
  ) {}
}

export const ASSETS_DELETE_ERROR = '[asset] ASSETS_DELETE_ERROR';
export class AssetsDeleteError implements Action {
  readonly type = ASSETS_DELETE_ERROR;
  constructor(
    readonly file: FileResponse
  ) {}
}

export const ASSETS_OPEN_FILE = '[asset] ASSETS_OPEN_FILE';
export class AssetsOpenFile implements Action {
  readonly type = ASSETS_OPEN_FILE;
  constructor(
    readonly file: string,
    readonly base: string
  ) {}
}

export const ASSETS_CLOSE_FILE = '[asset] ASSETS_CLOSE_FILE';
export class AssetsCloseFile implements Action {
  readonly type = ASSETS_CLOSE_FILE;
  constructor() {}
}

export const ASSETS_PIN = '[asset] ASSETS_PIN';
export class AssetsPin implements Action {
  readonly type = ASSETS_PIN;
  constructor(
    readonly file: FileResponse,
    readonly context: string = ''
  ) {}
}

export const ASSETS_UNPIN = '[assets] ASSETS_UNPIN';
export class AssetsUnpin implements Action {
  readonly type = ASSETS_UNPIN;
  constructor(
    readonly file: FileResponse,
    readonly context: string = ''
  ) {}
}

export type AssetsActions = AssetLoadFolder
  | AssetLoadFolderSuccess
  | AssetsSetCurrentFolder
  | AssetsUpload
  | AssetsUploadSuccess
  | AssetsUploadError
  | AssetsDelete
  | AssetsDeleteSuccess
  | AssetsOpenFile
  | AssetsCloseFile
  | AssetsPin
  | AssetsUnpin
;
