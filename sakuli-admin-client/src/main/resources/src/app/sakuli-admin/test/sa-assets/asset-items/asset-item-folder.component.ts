import {Component} from '@angular/core';
import {AbstractAssetItem, AssetItemStyle} from "./asset-item.abstract-class";

@Component({
  selector: 'asset-item-folder',
  template: `
      <div class="card"
           style="width: 100%"
           container="body"
           placement="top" [ngbTooltip]="item | absPath"
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

export class AssetItemFolderComponent extends AbstractAssetItem {
}
