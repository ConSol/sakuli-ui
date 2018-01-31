import {Component} from '@angular/core';
import {AbstractAssetItem, AssetItemStyle} from "./asset-item.abstract-class";

@Component({
  selector: 'asset-item-image',
  template: `  
    <div class="card"
         container="body"
         placement="top" [ngbTooltip]="item | absPath"
    >
      <div class="card-img-top grow d-flex flex-column justify-content-center">
        <div class="text-center">
          <img scAuthenticated [src]="'api/files?path=' + basePath + (item | absPath)" [alt]="item | absPath">
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

export class AssetItemImageComponent extends AbstractAssetItem {

}
