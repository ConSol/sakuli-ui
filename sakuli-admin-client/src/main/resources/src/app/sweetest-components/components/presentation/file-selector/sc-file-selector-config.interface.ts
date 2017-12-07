import {FileSelectorFile} from "./file-selector.state";

export interface FileFilter {
  (file: FileSelectorFile): boolean
}

export interface ScFileSelectorConfig {
  root: string;
  buttons?: {
    cancel?: string,
    ok?: string
  },
  fileFilter?: FileFilter[],
}
