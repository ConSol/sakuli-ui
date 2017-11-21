import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {AbstractAssetItem, AssetItemStyle} from "./asset-item.abstract-class";

@Component({
  selector: 'asset-item-text',
  template: `
      <div class="card"
           style="width: 100%"
           container="body"
           placement="top" [ngbTooltip]="item | absPath"
      >
        <div class="card-img-top grow d-flex flex-column justify-content-center">
          <div class="text-center">
            <sc-icon icon="fa-file-o" [size]="5"></sc-icon>
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
export class AssetItemTextComponent extends AbstractAssetItem {
}
