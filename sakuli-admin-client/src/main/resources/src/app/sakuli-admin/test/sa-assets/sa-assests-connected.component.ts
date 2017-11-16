import {UploadEvent} from "./sa-assets.component";
import {currentChildren, currentFolder, uploading} from "./sa-assets.interface";
import {AssetsDelete, AssetsOpenFile, AssetsSetCurrentFolder, AssetsUpload} from "./sa-assets.action";
import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {AppState} from "../../appstate.interface";
import {testCase} from "../state/test.interface";
import {absPath, FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";

@Component({
  selector: 'sa-assets-connected',
  template: `
    <sa-assets
      [basePath]="suiteParam$ | async"
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
export class SaAssetsConnectedComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  suiteParam$ = this.route.params.map(p => decodeURIComponent(p['suite']));
  testCase$ = this.store.select(testCase);
  targetFolder$ = this.store.select(currentChildren);
  currentFolder$ = this.store.select(currentFolder);
  uploading$ = this.store.select(uploading);

  ngOnInit() {
    this.route.paramMap.subscribe(m => {
      const suite = m.has('suite') ? decodeURIComponent(m.get('suite')) : '';
      const file = m.has('file') ? decodeURIComponent(m.get('file')) : '';
      this.store.dispatch(new AssetsSetCurrentFolder(file, suite));
    });
  }

  onDelete(e: FileResponse) {
    this.store.dispatch(new AssetsDelete(e));
  }

  onUpload(e: UploadEvent) {
    this.store.dispatch(new AssetsUpload(e.files, e.targetFolder));
  }

  onFileSelected(f: FileResponse) {
    this.suiteParam$.first().subscribe(suite => {
      if(f.directory) {
        this.store.dispatch(new AssetsSetCurrentFolder(absPath(f), suite))
      } else {
        this.store.dispatch(new AssetsOpenFile(absPath(f), suite))
      }
    })
  }
}
