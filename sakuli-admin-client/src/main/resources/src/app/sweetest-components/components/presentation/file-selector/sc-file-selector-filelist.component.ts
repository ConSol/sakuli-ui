import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {
  CloseFileselectorfile,
  FileSelectorFile,
  fileSelectorSelectId,
  fileSelectorSelectors,
  OpenFileSelectorFile,
  SelectFileselectorfile
} from "./file-selector.state";
import {Store} from "@ngrx/store";
import {absPath} from "../../../services/access/model/file-response.interface";
import {FileSelectorFilter} from "./file-selector-filter.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-file-selector-filelist-component',
  template: `
    <ul>
      <li *ngFor="let file of filesFiltered"
          (click)="fileClick(file)"
          class="cursor-pointer"
          [ngClass]="{
              'text-muted': isInactive(file),
              'inactive': isInactive(file)
          }"
      >
        <ng-template #busy>
          <sc-icon icon="fa-spinner" [spin]="true"></sc-icon>
        </ng-template>
        <sc-icon [icon]="file.open ? 'fa-folder-open' : 'fa-folder'" [fixedWidth]="true"
                 *ngIf="file.directory"></sc-icon>
        <sc-icon icon="fa-file-o" [fixedWidth]="true" *ngIf="!file.directory"></sc-icon>
        <span class="file-name"
              [ngStyle]="{'font-weight': file.selected ? 'bold' : 'normal'}"
        >{{file.name}}</span>
        <sc-file-selector-filelist-component
          *ngIf="file.open"
          [files]="childrenFor(file) | async"
          [hide]="hide"
          [inactive]="inactive"
          (click)="$event.stopPropagation()"
        ></sc-file-selector-filelist-component>
      </li>
    </ul>
  `,
  styles: [`

    li:hover > .file-name {
      text-decoration: underline;
    }

    li.inactive:hover > .file-name. {
      text-decoration: none;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li ul {
      padding-left: 23px;
    }
  `]
})
export class ScFileSelectorFilelistComponent implements OnInit {

  @Input() files: FileSelectorFile[];

  @Input() hide: FileSelectorFilter;
  @Input() inactive: FileSelectorFilter;

  get filesFiltered(): FileSelectorFile[] {
    return this.files.filter(f => !this.hide(f));
  }

  constructor(readonly store: Store<any>) {
  }

  ngOnInit() {
    const allowAll = (t: boolean) => (file: FileSelectorFile) => t;
    this.hide = this.hide || allowAll(false);
    this.inactive = this.inactive || allowAll(false);
  }

  childrenFor(file: FileSelectorFile) {
    return this.store.select(fileSelectorSelectors.childrenFor(absPath(file)))
  }

  fileClick(file: FileSelectorFile) {
    const id = fileSelectorSelectId(file);
    if (!this.isInactive(file)) {
      this.store.dispatch(new SelectFileselectorfile(id));
    }
    if (file.directory) {
      const action = file.open ? new CloseFileselectorfile(id) : new OpenFileSelectorFile(id);
      this.store.dispatch(action);
    }
  }

  isInactive(file: FileSelectorFile) {
    return this.inactive(file);
  }

  isHidden(file: FileSelectorFile) {
    return this.hide(file);
  }
}
