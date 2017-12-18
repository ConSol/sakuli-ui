import {NgModule} from "@angular/core";
import {StompService} from "./stomp.service";
import {FileService} from "./file.service";
import {TestService} from "./test.service";
import {ProjectService} from "./project.service";
import {ScAuthenticationService} from "./sc-authentication.service";
import {ScHttpService, ScHttpServiceProvider} from "./sc-http.service";
import {Http, RequestOptions, XHRBackend} from "@angular/http";
import {ScLoginComponent} from "./auth/sc-login.component";
import {TokenService} from "./token.service";
import {Store} from "@ngrx/store";
import {ReactiveFormsModule} from "@angular/forms";
import {EffectsModule} from "@ngrx/effects";
import {HttpEffects} from "./http.state";

export const providers = [
  ProjectService,
  TestService,
  FileService,
  StompService,
  ScAuthenticationService,
  TokenService,
  HttpEffects
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    EffectsModule.forFeature([HttpEffects])
  ],
  entryComponents: [
    ScLoginComponent
  ],
  declarations: [
    ScLoginComponent
  ],
  providers: [
    ...providers,
    {
      provide: Http,
      useFactory: ScHttpServiceProvider,
      deps: [XHRBackend, RequestOptions, TokenService, Store]
    }
  ],
  exports: [
    ScLoginComponent
  ]
})
export class ScAccessModule {
}
