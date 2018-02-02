import {NgModule} from "@angular/core";
import {PreventRoutingGuardService} from "./prevent-routing-guard.service";
import {InplaceFileEditorComponent} from "./inplace-file-editor.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ScEditorComponent} from "./editor/sc-editor.component";
import {ScIconModule} from "../presentation/icon/sc-icon.module";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {KeyValueListComponent} from "./key-value-list/key-value-list.component";

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ScIconModule,
    CommonModule,
    NgbModule
  ],
  providers: [
    PreventRoutingGuardService
  ],
  declarations: [
    InplaceFileEditorComponent,
    ScEditorComponent,
    KeyValueListComponent
  ],
  exports: [
    InplaceFileEditorComponent,
    ScEditorComponent,
    KeyValueListComponent
  ]
})
export class ScFormsModule {}
