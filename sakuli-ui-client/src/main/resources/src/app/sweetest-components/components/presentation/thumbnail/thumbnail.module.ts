import {NgModule} from '@angular/core';
import {ThumbnailComponent} from "./thumbnail.component";
import {PortalModule} from "@angular/cdk/portal";
import {OverlayModule} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";
import {ScAuthModule} from "../../../services/access/auth/sc-auth.module";
import {ScIconModule} from "../icon/sc-icon.module";


@NgModule({
  imports: [
    PortalModule,
    OverlayModule,
    CommonModule,
    ScAuthModule,
    ScIconModule
  ],
  exports: [
    ThumbnailComponent
  ],
  declarations: [ThumbnailComponent],
  providers: [],
})
export class ThumbnailModule {
}

