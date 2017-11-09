import {NgModule} from '@angular/core';
import {RunConfigurationComponent} from './run-configuration.component';
import {StoreModule} from "@ngrx/store";
import {RunConfigurationFeatureName} from "./run-configuration.interface";
import {runConfigurationReducer} from "./run-configuration.reducer";
import {CommonModule} from "@angular/common";
import {SweetestComponentsModule} from "../../../sweetest-components/index";
import {EffectsModule} from "@ngrx/effects";
import {RunConfigurationEffects} from "./run-configuration.effects";
import {RunConfigurationService} from "../../../sweetest-components/services/access/run-configuration.service";
import {HttpModule} from "@angular/http";

const declareAndExports = [
  RunConfigurationComponent,
]

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    SweetestComponentsModule,
    StoreModule.forFeature(RunConfigurationFeatureName, runConfigurationReducer),
    EffectsModule.forFeature([
      RunConfigurationEffects
    ])
  ],
  exports: [...declareAndExports],
  declarations: [...declareAndExports],
  providers: [
    RunConfigurationEffects,
    RunConfigurationService
  ],
})
export class RunConfigurationModule {
}
