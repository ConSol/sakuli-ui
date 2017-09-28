import {NgModule} from '@angular/core';
import {TestComponent} from './test.component';
import {CommonModule} from '@angular/common';
import {SweetestComponentsModule} from '../../sweetest-components/index';
import {StoreModule} from '@ngrx/store';
import {testReducer} from './state/test.reducer';
import {EffectsModule} from "@ngrx/effects";
import {TestEffects} from "./state/test.effects";
import {RouterModule} from "@angular/router";
import {TestDetailComponent} from "./test-detail/test-detail.component";
import {SaSourceComponent} from "./test-detail/tabs/source.component";
import {RunTestSuiteComponent} from "./run-test-suite.component";
import {LogModalComponent} from "./test-detail/log-modal.component";
import {SaAssetsModule} from "./test-detail/tabs/sa-assets/sa-assets.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TestDetailConnectedComponent} from "app/sakuli-admin/test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./configuration/sa-configuration.component";
import {RunConfigurationModule} from "./run-configuration/run-configuration.module";
import {SaDockerPullInfoComponent} from "./sa-docker-pull-info.component";

export const DeclareAndExport = [
  TestComponent,
  TestDetailComponent,
  SaSourceComponent,
  RunTestSuiteComponent,
  LogModalComponent,
  TestDetailConnectedComponent,
  SaConfigurationComponent,
  SaDockerPullInfoComponent
];

@NgModule({
  imports: [
    CommonModule,
    SweetestComponentsModule,
    NgbModule,
    EffectsModule.forFeature([TestEffects]),
    StoreModule.forFeature('test', testReducer),
    RouterModule,
    SaAssetsModule,
    RunConfigurationModule
  ],
  entryComponents: [
    LogModalComponent
  ],
  providers: [
    TestEffects
  ],
  declarations: [
    ...DeclareAndExport
  ],
  exports: [
    ...DeclareAndExport
  ]
})
export class TestModule {
}
