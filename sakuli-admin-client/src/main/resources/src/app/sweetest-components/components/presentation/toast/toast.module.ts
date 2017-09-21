import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {toastReducer} from "./toast.reducer";
import {ScToastService} from "./toast.service";
import {ScToastContainerComponent} from "./toast-container.component";
import {CommonModule} from "@angular/common";
import {ScToastComponent} from "./toast.component";

export const exportAndDeclare = [
  ScToastContainerComponent,
  ScToastComponent
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('scToast', toastReducer)
  ],
  providers: [
    ScToastService
  ],
  exports: exportAndDeclare,
  declarations: exportAndDeclare
})
export class ToastModule {}
