import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dasboard.component";
import {SweetestComponentsModule} from "../../sweetest-components/index";
import {DashboardService} from "./dashboard.service";
import {EffectsModule} from "@ngrx/effects";
import {CommonModule} from "@angular/common";
import {DashboardConnectedComponent} from "./dashboard-connected.component";
import {TestsuiteStatsComponent} from "./testsuite-stats.component";
import {StateStateListItemComponent} from "./state-state-list-item.component";
import {SaReportModule} from "../test/report/sa-report.module";

const declareAndExport = [
  DashboardComponent,
  DashboardConnectedComponent,
  TestsuiteStatsComponent,
  StateStateListItemComponent,
]

@NgModule({
  imports: [
    SaReportModule,
    CommonModule,
    SweetestComponentsModule,
    EffectsModule.forFeature([DashboardService]),
  ],
  declarations: [...declareAndExport],

  providers: [
    DashboardService,
  ],
  exports: [...declareAndExport]
})
export class DashboardModule {}
