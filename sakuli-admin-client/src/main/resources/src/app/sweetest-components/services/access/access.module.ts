import {NgModule} from "@angular/core";
import {StompService} from "./stomp.service";
import {FileService} from "./file.service";
import {TestService} from "./test.service";
import {HttpClientModule} from "@angular/common/http";
import {ScAuthModule} from "./auth/sc-auth.module";

export const providers = [
  TestService,
  FileService,
  StompService,
];

@NgModule({
  imports: [
    HttpClientModule,
    ScAuthModule
  ],
  providers: [
    ...providers,
  ],
  exports: [
    ScAuthModule
  ]
})
export class ScAccessModule {
}
