import {NgModule} from '@angular/core';
import {ScLoadingComponent} from './sc-loading.component';
import {StoreModule} from "@ngrx/store";
import {ScLoadingFeatureName, scLoadingReducer} from "./sc-loading.state";
import {CommonModule} from "@angular/common";
import {ScIconModule} from "../icon/sc-icon.module";


@NgModule({
  imports: [
    CommonModule,
    ScIconModule,
    StoreModule.forFeature(ScLoadingFeatureName, scLoadingReducer)
  ],
  exports: [ScLoadingComponent],
  declarations: [ScLoadingComponent],
  providers: [],
})
export class ScLoadingModule {
}
