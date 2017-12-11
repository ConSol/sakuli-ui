import {TestCaseResult, TestSuiteResult} from "../../sweetest-components/services/access/model/test-result.interface";
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
          <div class="shade mb-3 p-3" *ngFor="let testSuite of testSuites">
              <h4 class="border-bottom-1">{{testSuite.id}}</h4>
              <testsuite-stats-component [results]="getResultsForSuite(testSuite)"></testsuite-stats-component>
          </div>
        </ng-container>
      </article>
    </sc-content>
  `
})
export class DashboardComponent {

  @Input() testSuites: SakuliTestSuite[];
  @Input() testResults: TestSuiteResult[];

  @Output() refresh = new EventEmitter<void>();

  getResultsForSuite(testSuite: SakuliTestSuite) {
    return this.testResults.filter(tr => {
      return (tr.testSuiteFolder || '').endsWith(testSuite.root)
    })
  }
}

