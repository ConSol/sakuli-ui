import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {toastReducer} from "./toast.reducer";
import {ScToastService} from "./toast.service";
import {ScToastContainerComponent} from "./toast-container.component";
import {CommonModule} from "@angular/common";
import {ScToastComponent} from "./toast.component";
import {ScIconModule} from "../icon/sc-icon.module";
import {NGRX_TOAST_FEATURE_NAME} from "./toast-state.interface";

export const exportAndDeclare = [
  ScToastContainerComponent,
  ScToastComponent
];

@NgModule({
  imports: [
    CommonModule,
    ScIconModule,
    StoreModule.forFeature(NGRX_TOAST_FEATURE_NAME, toastReducer)
  ],
  providers: [
    ScToastService
  ],
  exports: exportAndDeclare,
  declarations: exportAndDeclare
})
export class ScToastModule {

}
