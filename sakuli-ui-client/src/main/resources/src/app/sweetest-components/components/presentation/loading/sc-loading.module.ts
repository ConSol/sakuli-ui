import {NgModule} from '@angular/core';
import {ScLoadingComponent} from './sc-loading.component';
import {StoreModule} from "@ngrx/store";
import {ScLoadingFeatureName, scLoadingReducer} from "./sc-loading.state";
import {CommonModule} from "@angular/common";
import {ScIconModule} from "../icon/sc-icon.module";
import {ScLoadingService} from "./sc-loading.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ScLoadingPresentationComponent} from "./sc-loading-presentation.component";


@NgModule({
  imports: [
    CommonModule,
    ScIconModule,
    NgbModule,
    StoreModule.forFeature(ScLoadingFeatureName, scLoadingReducer)
  ],
  exports: [ScLoadingComponent, ScLoadingPresentationComponent],
  declarations: [ScLoadingComponent, ScLoadingPresentationComponent],
  providers: [
    ScLoadingService
  ],
})
export class ScLoadingModule {
}
