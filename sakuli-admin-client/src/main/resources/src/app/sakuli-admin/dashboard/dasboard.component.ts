import {TestSuiteResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-dashboard',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-cube"
        title="Dashboard"
      >
        <sc-icon
          class="cursor-pointer"
          icon="fa-refresh"
          (click)="refresh.next()"
        ></sc-icon>
      </sc-heading>
      <article class="d-flex flex-column">
        <sc-loading displayAs="progressbar" for="loadingTestResults" #loading></sc-loading>
        <ng-container *ngIf="!(loading.show$ | async)">
          <ng-container *ngFor="let testSuite of testSuites">
            <sa-report-navigation
              [testResult]="first(getResultsForSuite(testSuite))"
              [navigation]="false"
            ></sa-report-navigation>
            <div class="shade mb-3 p-3">
              <testsuite-stats-component [results]="getResultsForSuite(testSuite)"></testsuite-stats-component>
            </div>
          </ng-container>
        </ng-container>
      </article>
    </sc-content>
  `
})
export class DashboardComponent {

  @Input() testSuites: SakuliTestSuite[];
  @Input() testResults: TestSuiteResult[];

  @Output() refresh = new EventEmitter<void>();

  first<T>(array: T[], defaultValue?: T): T {
    return array[0] || defaultValue;
  }

  getResultsForSuite(testSuite: SakuliTestSuite) {
    return this.testResults.filter(tr => {
      return (tr.testSuiteFolder || '').endsWith(testSuite.root)
    })
  }
}

