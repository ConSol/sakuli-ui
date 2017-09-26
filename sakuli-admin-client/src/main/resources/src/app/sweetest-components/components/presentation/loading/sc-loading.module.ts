import {NgModule} from '@angular/core';
import {ScLoadingComponent} from './sc-loading.component';
import {StoreModule} from "@ngrx/store";
import {ScLoadingFeatureName, scLoadingReducer} from "./sc-loading.state";
import {CommonModule} from "@angular/common";
import {ScIconModule} from "../icon/sc-icon.module";
import {ScLoadingService} from "./sc-loading.service";
import {NgbModule, NgbProgressbarModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  imports: [
    CommonModule,
    ScIconModule,
    NgbModule,
    StoreModule.forFeature(ScLoadingFeatureName, scLoadingReducer)
  ],
  exports: [ScLoadingComponent],
  declarations: [ScLoadingComponent],
  providers: [
    ScLoadingService
  ],
})
export class ScLoadingModule {
}
