import {AppState} from "../../../../appstate.interface";
import {UploadEvent} from "./sa-assets.component";
import {testCase} from "../../../state/test.interface";
import {currentChildren, currentFolder, uploading} from "./sa-assets.interface";
import {projectFileRoot} from "../../../../project/state/project.interface";
import {absPath, FileResponse} from "../../../../../sweetest-components/services/access/model/file-response.interface";
import {AssetsDelete, AssetsOpenFile, AssetsSetCurrentFolder, AssetsUpload} from "./sa-assets.action";
import {Component} from '@angular/core';
import {Store} from "@ngrx/store";

@Component({
  selector: 'sa-assests-connected',
  template: `
    <sa-assets
      [basePath]="basePath$ | async"
      [currentFolder]="currentFolder$ | async"
      [targetFolders]="targetFolder$ | async"
      [testCase]="testCase$ | async"
      [uploading]="uploading$ | async"
      (delete)="onDelete($event)"
      (fileSelected)="onFileSelected($event)"
      (upload)="onUpload($event)"
    ></sa-assets>
  `
})
export class SaAssetsConnectedComponent {

  constructor(
    private store: Store<AppState>
  ) {}

  testCase$ = this.store.select(testCase);
  targetFolder$ = this.store.select(currentChildren);
  currentFolder$ = this.store.select(currentFolder);
  basePath$ = this.store.select(projectFileRoot);
  uploading$ = this.store.select(uploading);

  onDelete(e: FileResponse) {
    this.store.dispatch(new AssetsDelete(e));
  }

  onUpload(e: UploadEvent) {
    this.store.dispatch(new AssetsUpload(e.files, e.targetFolder));
  }

  onFileSelected(f: FileResponse) {
    f.directory ?
      new AssetsSetCurrentFolder(absPath(f)):
      new AssetsOpenFile(absPath(f))

    if(f.directory) {
      this.store.dispatch(new AssetsSetCurrentFolder(absPath(f)))
    } else {
      this.store.dispatch(new AssetsOpenFile(absPath(f)))
    }
  }
}
