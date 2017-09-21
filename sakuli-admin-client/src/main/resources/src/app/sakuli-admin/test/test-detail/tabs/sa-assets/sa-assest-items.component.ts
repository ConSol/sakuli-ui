import {
  ChangeDetectionStrategy,
  Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, TemplateRef,
  ViewChild
} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SaImageModal} from "./sa-image-modal.component";
import {Store, StoreRootModule} from "@ngrx/store";
import {TestCase} from "../../../../../sweetest-components/services/access/model/test-suite.model";
import {
  FileResponse,
  FileWithContent
} from "../../../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../../../sweetest-components/services/access/file.service";
import {AppState} from "../../../../appstate.interface";
import {log, notNull} from "../../../../../core/redux.util";
import {AssetItemType, getItemType} from "./asset-item-type.enum";


@Component({
  selector: 'sa-assest-items',

  template: `
    
    <ng-container 
      *ngFor="let file of items" 
      [ngSwitch]="getItemType(file)">
      <asset-item-folder 
        *ngSwitchCase="itemTypes.Folder"
        [item]="file"
        (click)="onSelect(file)"
        (delete)="onDelete(file)"
      ></asset-item-folder>
      
      <asset-item-image 
        *ngSwitchCase="itemTypes.Image"
        [item]="file"
        [basePath]="basePath"
        (click)="onSelect(file)"
        (delete)="onDelete(file)"
      ></asset-item-image>
      <div *ngSwitchDefault="">
        <br />
      </div>
    </ng-container>
    <div *ngIf="!hasDisplayableItems" class="jumbotron col-12 text-center text-muted">
      <h3 class="display-3">No content in this folder</h3>
      <p>Add content by drag and drop, upload or past some image data</p>
      <p>
        <sc-icon icon="fa-upload" [size]="5"></sc-icon>
      </p>
    </div>
    <ng-template #confirm let-c="close" let-d="dismiss">
      <div class="modal-body">
        <strong>Confirm deletion</strong>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" (click)="d()">Cancel</button>
        <button class="btn btn-success" (click)="c('ok')">Ok</button>
      </div>
    </ng-template>
  `,
  styles: [`    
    input[type="file"] {
      display: none;
    }
  `]
})
export class SaAssetItemsComponent {

  @Input() items: FileResponse[];
  @Input() basePath;

  @Output() select = new EventEmitter<FileResponse>();
  @Output() delete = new EventEmitter<FileResponse>();

  @HostBinding('class')
  get cssClass() {
    return 'row'
  }

  itemTypes = AssetItemType;

  onSelect(file: FileResponse) {
    this.select.next(file);
  }

  onDelete(file: FileResponse) {
    this.delete.next(file);
  }

  get hasDisplayableItems() {
    return this.items
      .map(f => this.getItemType(f))
      .map(t => (t === AssetItemType.Image || t === AssetItemType.Folder) ? 1 : 0)
      .reduce((sum, i) => sum + i, 0) > 0;
  }

  getItemType(file: FileResponse): AssetItemType {
    return getItemType(file)
  }
}
