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
import {SaAssetsModule} from "./sa-assets/sa-assets.module";
import {NgbModule, NgbTooltip, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {TestDetailConnectedComponent} from "app/sakuli-admin/test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./configuration/sa-configuration.component";
import {RunConfigurationModule} from "./run-configuration/run-configuration.module";
import {SaDockerPullInfoComponent} from "./sa-docker-pull-info.component";
import {SaReportModule} from "./report/sa-report.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TestSuiteFeatureName, testsuiteReducer} from "./state/testsuite.state";
import {TestsuiteEffects} from "./state/testsuite.effects";
import {TestEditorFeatureName, testEditorReducer} from "./state/test-editor.interface";

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
    StoreModule.forFeature(TestSuiteFeatureName, testsuiteReducer),
    StoreModule.forFeature('test', testReducer),
    StoreModule.forFeature(TestEditorFeatureName, testEditorReducer),
    EffectsModule.forFeature([
      TestsuiteEffects,
      TestEffects,
    ]),
    RouterModule,
    SaAssetsModule,
    RunConfigurationModule,
    SaReportModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LogModalComponent
  ],
  providers: [
    TestEffects,
    TestsuiteEffects
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
