import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dasboard.component';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {TestComponent} from "./test/test.component";
import {SakuliProjectGuardService} from "./sakuli-project-guard.service";
import {SaAssetsComponent} from "./test/test-detail/tabs/sa-assets/sa-assets.component";
import {TestDetailComponent} from "./test/test-detail/test-detail.component";
import {SaAssetsConnectedComponent} from "./test/test-detail/tabs/sa-assets/sa-assests-connected.component";
import {TestDetailConnectedComponent} from "./test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./test/configuration/sa-configuration.component";
import {SaReportComponent} from "./test/report/sa-report.component";

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  // Test Module
  {
    path: 'test',
    canActivate: [
      SakuliProjectGuardService
    ],
    children: [
      {path: '', component: TestComponent},
      {
        path: 'sources', children: [
        {path: '', component: TestDetailConnectedComponent},
        {path: ':file', component: TestDetailConnectedComponent},
      ]
      },
      {
        path: 'assets', children: [
        {path: '', component: SaAssetsConnectedComponent},
        {path: ':file', component: SaAssetsConnectedComponent},
      ]
      },
      {
        path: 'configuration',
        component: SaConfigurationComponent
      },
      {
        path: 'reports',
        component: SaReportComponent
      }
    ]
  },
  // Project Module
  /*
  {
    path: 'project',
    children: [
      {path: 'open', component: ProjectOpenComponent}
    ]
  }
  */
  // dashbaord module
  {
    path: 'dashboard',
    component: DashboardComponent
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
