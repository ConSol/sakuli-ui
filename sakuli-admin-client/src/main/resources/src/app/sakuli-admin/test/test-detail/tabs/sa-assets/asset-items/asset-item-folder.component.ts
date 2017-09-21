import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {AssetItem, AssetItemStyle} from "./asset-item.abstract-class";
import {FileResponse} from "../../../../../../sweetest-components/services/access/model/file-response.interface";

@Component({
  selector: 'asset-item-folder',
  template: `
      <div class="card"
           style="width: 100%"
           placement="top" [ngbTooltip]="item"
      >
        <div class="card-img-top grow d-flex flex-column justify-content-center">
          <div class="text-center">
            <sc-icon icon="fa-folder" [size]="5"></sc-icon>
          </div>
        </div>
        <div class="card-footer d-flex flex-row justify-content-between">
          <div class="card-text" [title]="item | absPath">{{item.name}}
          </div>
        </div>
      </div>
  `,
  styles: [
    AssetItemStyle
  ]
})

export class AssetItemFolderComponent implements AssetItem {
  @Input() item: FileResponse;
  @Input() basePath;
  @Output() delete = new EventEmitter<FileResponse>();
  @Output() click = new EventEmitter<FileResponse>();

  @HostBinding('class')
  get hostBindingClass() {
    return 'card-wrapper col-12 col-md-4 col-lg-3 col-xl-2 d-flex flex-column';
  }


  onClick(file :FileResponse) {
    this.click.next(file);
  }

  onDelete(file: FileResponse) {
    this.delete.next(file);
  }
}
