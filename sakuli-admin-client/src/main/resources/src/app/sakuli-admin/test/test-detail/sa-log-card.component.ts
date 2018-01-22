import {
  ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {Observable} from "rxjs/Observable";
import {notNull} from "../../../core/redux.util";
import {testExecutionLogSelectors} from "../state/test-execution-log.state";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestExecutionEntity, testExecutionSelectors} from "../state/testexecution.state";
import {testSuiteSelectId} from "../state/testsuite.state";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-log-card',
  template: `
    <div class="card-header d-flex justify-content-between align-items-center">
      <div *ngIf="testRunInfo$ | async; let testRunInfo">
        <span class="text-muted">{{testRunInfo.timestamp | moment:'DD.MM.YYYY HH:mm:ss'}}</span>
      </div>
      <button class="m-0 p-0 btn btn-link" (click)="fullScreen()">
        <sc-icon icon="fa-expand"></sc-icon>
      </button>
    </div>
    <div class="card-content" #logs>
      <sc-logs  class="p-0" [follow]="true" [messages]="testRunLogs$ | async">
      </sc-logs>
    </div>
  `,
  styles: [`
    
    sc-logs {
      width: 100%;
      height: 100%;
    }
    
    .card-header {
      background-color: white;
      flex-shrink: 0;
    }

    .card-content {
      overflow: auto;
      display: flex;
      flex-direction: row;
      background: rgb(30, 30, 30);
      flex-grow: 1;
    }

    .btn-fs:hover /deep/ .fa {
      transform: scale(1.2, 1.2) !important;
    }

  `]
})
export class SaLogCard implements OnInit, OnChanges {

  @Input() testSuite: SakuliTestSuite;

  @ViewChild('logs') logs: ElementRef;

  testRunInfo$: Observable<TestExecutionEntity>;

  testRunLogs$: Observable<string[]>;

  fullScreen() {
    const elementRef = this.logs;
    const e = elementRef.nativeElement;
    console.log(
      e.requestFullscreen,
      e.mozRequestFullScreen,
      e.webkitRequestFullScreen
    )
    if (e.requestFullscreen) {
      e.requestFullscreen();
    } else if (e.mozRequestFullScreen) {
      e.mozRequestFullScreen();
    } else if (e.webkitRequestFullScreen) {
      e.webkitRequestFullScreen();
    }
  }

  @HostBinding('class')
  get hostClass() {
    return 'card';
  }

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.initObservablesWithTestSuite(this.testSuite);
  }

  ngOnChanges(change: SimpleChanges) {
    const tsChanges = change.testSuite;
    if (tsChanges) {
      const curr = tsChanges.currentValue;
      const prev = tsChanges.previousValue;
      if ((!prev && curr) || testSuiteSelectId(curr) !== testSuiteSelectId(prev)) {
        this.initObservablesWithTestSuite(curr);
      }
    }
  }


  initObservablesWithTestSuite(testSuite: SakuliTestSuite) {
    this.testRunLogs$ = this.store
      .select(testExecutionLogSelectors.latestForTestSuite(testSuite))
      .map(logs => logs.map(log => log.message))
      .debounceTime(250)
    ;

    this.testRunInfo$ = this.store
      .select(testExecutionSelectors.latestByTestSuite(this.testSuite))
      .filter(notNull).first();
  }

}
