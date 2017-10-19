import {NgModule} from "@angular/core";
import {SweetestComponentsModule} from "../../sweetest-components/index";
import {AppLogComponent} from "./app-log.component";

@NgModule({
  imports: [
    SweetestComponentsModule
  ],
  declarations: [
    AppLogComponent
  ]
})
export class SaAppLogModule {}
