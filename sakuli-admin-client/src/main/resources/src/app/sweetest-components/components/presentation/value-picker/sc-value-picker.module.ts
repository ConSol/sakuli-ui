import {NgModule} from "@angular/core";
import {ScValuePickerModalComponent} from "./sc-value-picker-modal.component";
import {ScFolderPickerComponent} from "./sc-value-picker.component";
import {CommonModule} from "@angular/common";
import {ScIconModule} from "../icon/sc-icon.module";

const de = [
  ScValuePickerModalComponent,
  ScFolderPickerComponent,
]

@NgModule({
  imports: [
    CommonModule,
    ScIconModule
  ],
  entryComponents: [
    ScValuePickerModalComponent
  ],
  declarations: [...de],
  exports: [...de]
})
export class ScValuePickerModule {}
