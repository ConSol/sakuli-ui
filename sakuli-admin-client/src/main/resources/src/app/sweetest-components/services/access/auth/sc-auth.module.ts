import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ScLoginComponent} from "./sc-login.component";
import {ScLogoutComponent} from "./sc-logout.component";
import {ScAuthInterceptorService} from "./sc-auth-interceptor.service";
import {ScTokenInterceptorService} from "./sc-token-interceptor.service";
import {StoreModule} from "@ngrx/store";
import {AuthFeatureName, authReducer} from "./auth.state";
import {EffectsModule} from "@ngrx/effects";
import {ScAuthenticationService} from "./sc-authentication.service";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forFeature(AuthFeatureName, authReducer),
    EffectsModule.forFeature([
      ScAuthenticationService
    ])
  ],
  exports: [
    ScLoginComponent,
    ScLogoutComponent
  ],
  declarations: [
    ScLoginComponent,
    ScLogoutComponent
  ],
  providers: [
    ScAuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ScTokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ScAuthInterceptorService,
      multi: true
    }
  ],
})
export class ScAuthModule {
}
