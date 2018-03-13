import {NgModule} from '@angular/core';
import {TestComponent} from './test.component';
import {CommonModule} from '@angular/common';
import {SweetestComponentsModule} from '../../sweetest-components';
import {StoreModule} from '@ngrx/store';
import {testReducer} from './state/test.reducer';
import {EffectsModule} from "@ngrx/effects";
import {TestEffects} from "./state/test.effects";
import {RouterModule} from "@angular/router";
import {TestDetailComponent} from "./test-detail/test-detail.component";
import {SaSourceComponent} from "./test-detail/tabs/source.component";
import {RunTestSuiteComponent} from "./run-test-suite.component";
import {SaLogCard} from "./test-detail/sa-log-card.component";
import {SaAssetsModule} from "./sa-assets/sa-assets.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TestDetailConnectedComponent} from "app/sakuli-admin/test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./configuration/sa-configuration.component";
import {RunConfigurationModule} from "./run-configuration/run-configuration.module";
import {SaDockerPullInfoComponent} from "./sa-docker-pull-info.component";
import {SaReportModule} from "./report/sa-report.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TestSuiteFeatureName, testsuiteReducer} from "./state/testsuite.state";
import {TestsuiteEffects} from "./state/testsuite.effects";
import {TestEditorFeatureName, testEditorReducer} from "./state/test-editor.interface";
import {TestExecutionFeatureName, testExecutionReducer} from "./state/testexecution.state";
import {TestExecutionLogFeatureName, testExecutionLogReducer} from "./state/test-execution-log.state";
import {SaVncCard} from "./test-detail/sa-vnc-card.component";

export const DeclareAndExport = [
  TestComponent,
  TestDetailComponent,
  SaSourceComponent,
  RunTestSuiteComponent,
  SaLogCard,
  SaVncCard,
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
    StoreModule.forFeature(TestExecutionFeatureName, testExecutionReducer),
    StoreModule.forFeature(TestExecutionLogFeatureName, testExecutionLogReducer),
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
    SaLogCard
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
