import {NgModule} from "@angular/core";
import {ScIconComponent} from "./sc-icon.component";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const DE = [
  ScIconComponent
]

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [
    ...DE
  ],
  exports: [
    ...DE
  ]

})
export class ScIconModule {}
