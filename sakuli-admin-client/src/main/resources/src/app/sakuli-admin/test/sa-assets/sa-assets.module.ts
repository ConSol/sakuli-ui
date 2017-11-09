import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SaImageModalComponent} from "./sa-image-modal.component";
import {SaAssetsComponent} from "./sa-assets.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SaAssetItemsComponent} from "./sa-assest-items.component";
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
import {SweetestComponentsModule} from "../../../sweetest-components/index";
import {ScValuePickerModule} from "../../../sweetest-components/components/presentation/value-picker/sc-value-picker.module";
import {AssetItemTextComponent} from "./asset-items/asset-item-text.component";
import {SaTextModalComponent} from "./sa-text-modal.component";

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
    ReactiveFormsModule,
  ],
  declarations: [
    SaImageModalComponent,
    SaAssetsComponent,
    SaAssetItemsComponent,
    AssetItemFolderComponent,
    AssetItemImageComponent,
    AssetItemTextComponent,
    SaAssetsConnectedComponent,
    SaTextModalComponent
  ],
  entryComponents: [
    SaImageModalComponent,
    SaTextModalComponent
  ],
  exports: [
    SaAssetsComponent
  ]
})
export class SaAssetsModule { }
