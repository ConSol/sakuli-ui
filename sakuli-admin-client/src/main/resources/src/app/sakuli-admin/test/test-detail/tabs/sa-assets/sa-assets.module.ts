import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SaImageModal} from "./sa-image-modal.component";
import {SaAssetsComponent} from "./sa-assets.component";
import {FormsModule} from "@angular/forms";
import {ScValuePickerModule} from "../../../../../sweetest-components/components/presentation/value-picker/sc-value-picker.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SaAssetItemsComponent} from "./sa-assest-items.component";
import {SweetestComponentsModule} from "../../../../../sweetest-components/index";
import {EffectsModule} from "@ngrx/effects";
import {SaAssetsEffects} from "./sa-assets.effects";
import {StoreModule} from "@ngrx/store";
import {assetReducer} from "./sa-assets.reducer";
import {
  ASSETS_FEATURE_NAME} from "./sa-assets.interface";
import {AssetItemFolderComponent} from "./asset-items/asset-item-folder.component";
import {AssetItemImageComponent} from "./asset-items/asset-item-image.component";
import {RouterModule} from "@angular/router";
import {SaAssetsConnectedComponent} from "./sa-assests-connected.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SweetestComponentsModule,
    ScValuePickerModule,
    NgbModule,
    StoreModule.forFeature(ASSETS_FEATURE_NAME, assetReducer),
    EffectsModule.forFeature([SaAssetsEffects]),
  ],
  declarations: [
    SaImageModal,
    SaAssetsComponent,
    SaAssetItemsComponent,
    AssetItemFolderComponent,
    AssetItemImageComponent,
    SaAssetsConnectedComponent
  ],
  entryComponents: [
    SaImageModal
  ],
  exports: [
    SaAssetsComponent
  ]
})
export class SaAssetsModule { }
