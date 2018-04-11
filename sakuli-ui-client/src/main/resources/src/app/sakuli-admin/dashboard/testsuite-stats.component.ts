import {Component, Input} from '@angular/core';
import {TestSuiteResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";
import {DateUtil} from "../../sweetest-components/utils";

@Component({
  selector: 'testsuite-stats-component',
  template: `
    <ng-template #noResults>
      <div class="jumbotron text-center">
        <h4 class="text-muted">No Results</h4>
      </div>
    </ng-template>
    <div class="row" *ngIf="results.length; else noResults">
      <div class="col">
        <sc-circle-indicator state="info" [value]="results.length">
          Runs
        </sc-circle-indicator>
      </div>
      <div class="col">
        <sc-circle-indicator state="info" [value]="averageTime">
          &#216; duration in seconds
        </sc-circle-indicator>
      </div>
      <div class="col">
        <h4>Result states:</h4>
        <div class="card border-0">
          <ul class="list-group">
            <state-state-list-item-component 
              *ngFor="let state of states"
              [state]="state.state" 
              [value]="state.relative"
            >
              {{state.total}} {{state.label}}
            </state-state-list-item-component>
          </ul>
        </div>
      </div>
      
    </div>
  `,
  styles: [`
    
  `]
})

export class TestsuiteStatsComponent {
  @Input() testSuite: SakuliTestSuite;
  @Input() results: TestSuiteResult[];

  private stateMap = {
    'ERRORS': 'danger',
    'CRITICAL_IN_SUITE': 'danger',
    'CRITICAL_IN_CASE': 'danger',
    'CRITICAL_IN_STEP': 'danger',
    'WARNING_IN_SUITE': 'warning',
    'WARNING_IN_CASE': 'warning',
    'WARNING_IN_STEP': 'warning',
    'OK': 'success'
  };
  get averageTime() {
    const duration = this.results
      .map(r => DateUtil.diff(r.stopDate, r.startDate))
      .reduce((s, d) => s + d, 0);
    return Math.round(duration / this.results.length / 1000);
  }

  get states() {
    const stateGroups = this.results.reduce(
      (sg, r) => ({...sg, [r.state]: (sg[r.state] || 0) + 1}), {}
    );
    const keys = Object.keys(stateGroups);
    const sum = keys
      .map(k => stateGroups[k])
      .reduce((s, n) => s + n, 0);

    return keys.map(k => ({
      label: k,
      state: this.stateMap[k],
      relative: `${(stateGroups[k] / sum) * 100}%`,
      total: stateGroups[k]
    }))
  }

}
