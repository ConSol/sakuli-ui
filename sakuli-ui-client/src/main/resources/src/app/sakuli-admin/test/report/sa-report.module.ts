import {NgModule} from '@angular/core';

import {SaReportComponent} from './sa-report.component';
import {SaActionComponent} from "./sa-action.component";
import {SaReportContentComponent} from "./sa-report-content.component";
import {SaReportNavigationComponent} from "./sa-report-navigation.component";
import {SaReportStepsTimingComponent} from "./sa-report-steps-timing.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SweetestComponentsModule} from "../../../sweetest-components/index";
import {CommonModule} from "@angular/common";
import {SaReportStepsComponent} from "./sa-report-steps.component";
import {SaReportTestcaseComponent} from "./sa-report-testcase.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SaReportOverviewComponent} from "./sa-report-overview.component";

const declareAndExport = [
  SaReportComponent,
  SaActionComponent,
  SaReportContentComponent,
  SaReportNavigationComponent,
  SaReportStepsTimingComponent,
  SaReportStepsComponent,
  SaReportTestcaseComponent,
  SaReportOverviewComponent
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SweetestComponentsModule,
    NgbModule,
  ],
  exports: [
    ...declareAndExport
  ],
  declarations: [
    ...declareAndExport
  ],
  providers: [],
})
export class SaReportModule {
}
