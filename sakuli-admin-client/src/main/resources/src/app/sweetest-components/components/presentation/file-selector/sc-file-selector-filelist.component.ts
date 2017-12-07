import {Component, Input} from '@angular/core';
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

@Component({
  selector: 'sc-file-selector-filelist-component',
  template: `
    <ul>
      <li *ngFor="let file of files" (click)="fileClick(file)" class="cursor-pointer">
        <ng-template #busy>
          <sc-icon icon="fa-spinner" [spin]="true"></sc-icon>
        </ng-template>
        <sc-icon [icon]="file.open ? 'fa-folder-open' : 'fa-folder'" [fixedWidth]="true" *ngIf="file.directory"></sc-icon>
        <sc-icon icon="fa-file-o" [fixedWidth]="true" *ngIf="!file.directory"></sc-icon>
        <span class="file-name" [ngStyle]="{'font-weight': file.selected ? 'bold' : 'normal'}">{{file.name}}</span>
        <sc-file-selector-filelist-component
          *ngIf="file.open"
          [files]="childrenFor(file) | async"
          (click)="$event.stopPropagation()"
        ></sc-file-selector-filelist-component>
      </li>
    </ul>
  `,
  styles: [`
        
    li:hover > .file-name {
      text-decoration: underline;
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
export class ScFileSelectorFilelistComponent {

  @Input() files: FileSelectorFile[];

  constructor(readonly store: Store<any>) {
  }

  childrenFor(file: FileSelectorFile) {
    return this.store.select(fileSelectorSelectors.childrenFor(absPath(file)))
  }

  fileClick(file: FileSelectorFile) {
    const id = fileSelectorSelectId(file);
    this.store.dispatch(new SelectFileselectorfile(id));
    if (file.directory) {
      const action = file.open ? new CloseFileselectorfile(id) : new OpenFileSelectorFile(id);
      this.store.dispatch(action);
    }
  }
}
