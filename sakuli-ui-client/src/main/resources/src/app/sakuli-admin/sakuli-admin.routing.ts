import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {TestComponent} from "./test/test.component";
import {SaAssetsConnectedComponent} from "./test/sa-assets/sa-assests-connected.component";
import {TestDetailConnectedComponent} from "./test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./test/configuration/sa-configuration.component";
import {SaReportComponent} from "./test/report/sa-report.component";
import {AppLogComponent} from "./app-log/app-log.component";
import {PreventRoutingGuardService} from "../sweetest-components/components/forms/prevent-routing-guard.service";
import {DashboardConnectedComponent} from "./dashboard/dashboard-connected.component";
import {LoginComponent} from "./login.component";
import {SaReportOverviewComponent} from "./test/report/sa-report-overview.component";
import {SakuliAuthProjectGuardService} from "./sakuli-auth-project-guard.service";

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
      SakuliAuthProjectGuardService
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
      SakuliAuthProjectGuardService
    ]
  },
  {
    path: 'testsuite',
    canActivate: [
      SakuliAuthProjectGuardService
    ],
    children: [
      {path: '', component: TestComponent},
      {
        path: 'sources',
        children: [
          {
            path: '',
            component: TestDetailConnectedComponent,
            canDeactivate: [PreventRoutingGuardService]
          },
        ]
      },
      {
        path: 'assets',
        children: [
          {
            path: '',
            component: SaAssetsConnectedComponent
          }
        ]
      },
      {
        path: 'configuration',
        component: SaConfigurationComponent,
        canDeactivate: [PreventRoutingGuardService]
      },
    ]
  },
  {
    path: 'app-log',
    component: AppLogComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
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
