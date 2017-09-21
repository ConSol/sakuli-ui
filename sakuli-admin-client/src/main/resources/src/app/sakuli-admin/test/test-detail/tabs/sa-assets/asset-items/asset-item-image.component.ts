import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {
  absPath,
  FileResponse
} from "../../../../../../sweetest-components/services/access/model/file-response.interface";
import {AssetItem, AssetItemStyle} from "./asset-item.abstract-class";

@Component({
  selector: 'asset-item-image',
  template: `  
    <div class="card"
         placement="top" [ngbTooltip]="item | absPath"
    >
      <div class="card-img-top grow d-flex flex-column justify-content-center">
        <div class="text-center">
          <img [src]="basePath + (item | absPath)" [alt]="item | absPath">
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div class="card-text" [title]="item | absPath">{{item.name}}
        </div>
        <sc-icon icon="fa-trash" (click)="$event.stopPropagation(); onDelete(item)"></sc-icon>
      </div>
    </div>
  `,
  styles: [
    AssetItemStyle,
    `
        img {
          max-width: 50%;
        }
    `
  ]
})

export class AssetItemImageComponent implements AssetItem {
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
