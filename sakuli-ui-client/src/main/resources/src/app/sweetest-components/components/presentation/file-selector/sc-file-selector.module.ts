import {NgModule} from '@angular/core';
import {ScFileSelectorComponent} from "./sc-file-selector.component";
import {ScFileSelectorFilelistComponent} from "./sc-file-selector-filelist.component";
import {CommonModule} from "@angular/common";
import {ScIconModule} from "../icon/sc-icon.module";
import {ScFileSelectorService} from "./sc-file-selector.service";
import {ScFileSelectorModalComponent} from "./sc-file-selector-modal.component";
import {StoreModule} from "@ngrx/store";
import {FileSelectorFeatureName, fileSelectorReducer} from "./file-selector.state";
import {EffectsModule} from "@ngrx/effects";

const declareAndExports = [
  ScFileSelectorComponent,
  ScFileSelectorFilelistComponent
];

@NgModule({
  imports: [
    CommonModule,
    ScIconModule,
    StoreModule.forFeature(FileSelectorFeatureName, fileSelectorReducer),
    EffectsModule.forFeature([ScFileSelectorService])
  ],
  exports: [
    ...declareAndExports
  ],
  declarations: [
    ...declareAndExports,
    ScFileSelectorModalComponent
  ],
  entryComponents: [
    ScFileSelectorModalComponent
  ],
  providers: [
    ScFileSelectorService,
  ],
})
export class ScFileSelectorModule {
}
