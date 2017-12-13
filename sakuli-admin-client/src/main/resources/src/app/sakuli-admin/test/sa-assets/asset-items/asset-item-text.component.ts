import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {AbstractAssetItem, AssetItemStyle} from "./asset-item.abstract-class";
import {FileResponse} from "../../../../sweetest-components/services/access/model/file-response.interface";
import {AppState} from "../../../appstate.interface";
import {Store} from "@ngrx/store";
import {AssetsPin} from "../sa-assets.action";

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
          <sc-icon class="ml-1" 
                   icon="fa-thumb-tack"
                   [ngbTooltip]="'Pin to left-menu'"
                   container="body"
                   placement="left"
                   (click)="pin($event, item)"
          ></sc-icon>
        </div>
      </div>
  `,
  styles: [
    AssetItemStyle
  ]
})
export class AssetItemTextComponent extends AbstractAssetItem {

  @Output() pinFile = new EventEmitter<FileResponse>();

  pin($event: MouseEvent, item:FileResponse) {
    console.log($event, item);
    this.pinFile.next(item);
    $event.stopPropagation();
  }
}
