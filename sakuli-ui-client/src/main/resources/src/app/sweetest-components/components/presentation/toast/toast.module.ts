import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {toastReducer} from "./toast.reducer";
import {ScToastService} from "./toast.service";
import {ScToastContainerComponent} from "./toast-container.component";
import {CommonModule} from "@angular/common";
import {ScToastComponent} from "./toast.component";
import {ScIconModule} from "../icon/sc-icon.module";
import {ScToastFeatureName} from "./toast-state.interface";
import {EffectsModule} from "@ngrx/effects";

export const exportAndDeclare = [
  ScToastContainerComponent,
  ScToastComponent
];

@NgModule({
  imports: [
    CommonModule,
    ScIconModule,
    StoreModule.forFeature(ScToastFeatureName, toastReducer),
    EffectsModule.forFeature([ScToastService])
  ],
  providers: [
    ScToastService
  ],
  exports: exportAndDeclare,
  declarations: exportAndDeclare
})
export class ScToastModule {

}
