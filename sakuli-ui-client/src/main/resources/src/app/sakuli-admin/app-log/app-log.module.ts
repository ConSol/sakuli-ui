import {NgModule} from "@angular/core";
import {SweetestComponentsModule} from "../../sweetest-components/index";
import {AppLogComponent} from "./app-log.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    SweetestComponentsModule,
    CommonModule
  ],
  declarations: [
    AppLogComponent
  ]
})
export class SaAppLogModule {}
