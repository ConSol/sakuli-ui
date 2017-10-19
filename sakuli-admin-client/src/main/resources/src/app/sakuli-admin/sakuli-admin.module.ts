import {NgModule} from '@angular/core';
import {SweetestComponentsModule} from '../sweetest-components/index';
import {SakuliAdminRoutingModule} from './sakuli-admin.routing';
import {ProjectModule} from './project/project.module';
import {EffectsModule} from "@ngrx/effects";
import {TestModule} from "./test/test.module";
import {StoreRouterConnectingModule} from "@ngrx/router-store";
import {SakuliProjectGuardService} from "./sakuli-project-guard.service";
import {FormsModule} from "@angular/forms";
import {DashboardModule} from "./dashboard/dashboard.module";
import {SaAppLogModule} from "./app-log/app-log.module";

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
  ],
  providers: [
    SakuliProjectGuardService
  ],
  exports: [
    SakuliAdminRoutingModule,
    ProjectModule
  ],
  declarations: [
  ]
})
export class SakuliAdminModule {}
