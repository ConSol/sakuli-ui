import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  AddFileSelectorFiles, DEFAULT_FILESELECTORFILE_SORT,
  FileSelectorFile,
  FileSelectorFileFromFileResponse,
  fileSelectorSelectors
} from "./file-selector.state";
import {FileService} from "../../../services/access/file.service";
import {Observable} from "rxjs/Observable";
import {FileSelectorFilter, FileSelectorSort} from "./file-selector-filter.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-file-selector-component',
  template: `
    <sc-file-selector-filelist-component
      [files]="files$ | async"
      [hide]="hide"
      [inactive]="inactive"
    ></sc-file-selector-filelist-component>
  `
})
export class ScFileSelectorComponent implements OnInit {

  @Input() root: string;
  @Input() hide: FileSelectorFilter;
  @Input() inactive: FileSelectorFilter;
  @Input() sort: FileSelectorSort;

  files$: Observable<FileSelectorFile[]>;

  constructor(
    readonly store: Store<any>,
    readonly fileService: FileService
  ) {
  }

  ngOnInit() {
    this.files$ = this.store.select(fileSelectorSelectors.childrenFor(this.root, this.sort || DEFAULT_FILESELECTORFILE_SORT));
    this.fileService
      .files(this.root)
      .subscribe(files => {
        this.store.dispatch(new AddFileSelectorFiles(files.map(FileSelectorFileFromFileResponse)))
      })
  }
}
