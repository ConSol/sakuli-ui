import {NgModule} from '@angular/core';
import {SaHelpComponent} from './sa-help.component';
import {SweetestComponentsModule} from "../../sweetest-components";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    SweetestComponentsModule,
    CommonModule,
    HttpClientModule
  ],
  exports: [],
  declarations: [SaHelpComponent],
  providers: [],
})
export class SaHelpModule {
}
