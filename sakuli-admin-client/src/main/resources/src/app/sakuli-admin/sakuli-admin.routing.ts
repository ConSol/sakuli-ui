import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {TestComponent} from "./test/test.component";
import {SakuliProjectGuardService} from "./sakuli-project-guard.service";
import {SaAssetsConnectedComponent} from "./test/sa-assets/sa-assests-connected.component";
import {TestDetailConnectedComponent} from "./test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./test/configuration/sa-configuration.component";
import {SaReportComponent} from "./test/report/sa-report.component";
import {AppLogComponent} from "./app-log/app-log.component";
import {PreventRoutingGuardService} from "../sweetest-components/components/forms/prevent-routing-guard.service";
import {DashboardConnectedComponent} from "./dashboard/dashboard-connected.component";
import {LoginComponent} from "./login.component";
import {SaReportOverviewComponent} from "./test/report/sa-report-overview.component";
import {SakuliAuthGuardService} from "./sakuli-auth-guard.service";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reports',
    canActivate: [
      SakuliAuthGuardService,
      SakuliProjectGuardService
    ],
    children: [
      {
        path: '',
        component: SaReportOverviewComponent,
      },
      {
        path: ':report', component: SaReportComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardConnectedComponent,
    canActivate: [
      SakuliAuthGuardService,
      SakuliProjectGuardService
    ]
  },
  {
    path: 'testsuite',
    canActivate: [
      SakuliAuthGuardService,
      SakuliProjectGuardService
    ],
    children: [
      {path: ':suite', component: TestComponent},
      {
        path: ':suite/sources',
        children: [
          {
            path: '',
            component: TestDetailConnectedComponent
          },
          {
            path: ':file',
            component: TestDetailConnectedComponent,
            canDeactivate: [PreventRoutingGuardService]
          },
        ]
      },
      {
        path: ':suite/assets',
        children: [
          {
            path: '',
            component: SaAssetsConnectedComponent
          },
          {
            path: ':file',
            component: SaAssetsConnectedComponent,
          },
        ]
      },
      {
        path: ':suite/configuration',
        component: SaConfigurationComponent,
        canDeactivate: [PreventRoutingGuardService]
      },
    ]
  },
  {
    path: 'app-log',
    component: AppLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ]
})
export class SakuliAdminRoutingModule {
}
