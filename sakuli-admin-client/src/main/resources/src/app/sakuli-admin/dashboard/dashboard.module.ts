import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dasboard.component";
import {SweetestComponentsModule} from "../../sweetest-components/index";
import {DashboardService} from "./dashboard.service";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {NgrxUtilModule} from "../../sweetest-components/services/ngrx-util/ngrx-util.module";
import {CommonModule} from "@angular/common";

const declareAndExport = [
  DashboardComponent
]

@NgModule({
  imports: [
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
