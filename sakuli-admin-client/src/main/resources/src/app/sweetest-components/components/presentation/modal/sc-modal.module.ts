import {NgModule} from "@angular/core";
import {ScModalService} from "./sc-modal.service";
import {ScModalComponent} from "./sc-modal.component";

@NgModule({
  declarations: [
    ScModalComponent
  ],
  providers: [
    ScModalService
  ]
})
export class ScModalModule {}
