import {NgModule} from '@angular/core';
import {SweetestComponentsModule} from '../sweetest-components/index';
import {SakuliAdminRoutingModule} from './sakuli-admin.routing';
import {ProjectModule} from './workspace/project.module';
import {EffectsModule} from "@ngrx/effects";
import {TestModule} from "./test/test.module";
import {StoreRouterConnectingModule} from "@ngrx/router-store";
import {SakuliProjectGuardService} from "./sakuli-project-guard.service";
import {FormsModule} from "@angular/forms";
import {DashboardModule} from "./dashboard/dashboard.module";
import {SaAppLogModule} from "./app-log/app-log.module";
import {BrowserModule} from "@angular/platform-browser";
import {LoginComponent} from "./login.component";
import {SakuliAuthGuardService} from "./sakuli-auth-guard.service";
import {SakuliAuthProjectGuardService} from "./sakuli-auth-project-guard.service";

@NgModule({
  imports: [
    SweetestComponentsModule,
    SakuliAdminRoutingModule,
    DashboardModule,
    EffectsModule.forRoot([]),
    ProjectModule,
    TestModule,
    StoreRouterConnectingModule,
    FormsModule,
    SaAppLogModule,
    BrowserModule
  ],
  providers: [
    SakuliProjectGuardService,
    SakuliAuthGuardService,
    SakuliAuthProjectGuardService
  ],
  exports: [
    SakuliAdminRoutingModule,
    ProjectModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class SakuliAdminModule {}
