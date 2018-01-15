import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";
import {animate, style, transition, trigger} from "@angular/animations";
import {
  RunConfiguration, RunConfigurationSelect,
  SakuliContainer
} from "./run-configuration/run-configuration.interface";
import {
  LoadRunConfiguration, LoadSakuliContainer, SAVE_RUN_CONFIGURATION_SUCCESS, SaveRunConfiguration,
  SelectSakuliContainer
} from "./run-configuration/run-configuration.actions";
import {Observable} from "rxjs/Observable";
import {RunConfigurationTypes} from "./run-configuration/run-configuration-types.enum";
import {log, notNull} from "../../core/redux.util";
import {Actions} from "@ngrx/effects";
import {
  DockerPullInfo, dockerPullInfoForCurrentRunInfoAsArray, dockerPullStreamForCurrentRunInfo,
  testSelectors,
} from "./state/test.interface";
import {ActivatedRoute} from "@angular/router";
import {RunTest, TestExecutionEntity, testExecutionSelectors} from "./state/testexecution.state";
import {testExecutionLogSelectors} from "./state/test-execution-log.state";
import {testSuiteSelectId} from "./state/testsuite.state";
import {TestSuiteResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {LoadTestResults} from "./state/test.actions";
import {RouterGo} from "../../sweetest-components/services/router/router.actions";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'run-test-suite',
  animations: [
    trigger('onVnc', [
      transition(':enter', [
        style({
          transform: 'scale(0,0)'
        }),
        animate(".25s ease-in", style({transform: 'scale(1,1)'}))
      ]),
      transition(':leave', [
        animate(".25s ease-in", style({transform: 'scale(0,0)'}))
      ])
    ]),
    trigger('openConfig', [
      transition(':enter', [
        style({
          height: 0,
          overflowY: 'hidden',
          paddingTop: 0,
          paddingBottom: 0,
        }),
        animate(".5s ease-out", style({
          height: 'auto',
          overflowY: 'initial',
          paddingTop: '*',
          paddingBottom: '*'
        }))
      ]),
      transition(':leave', [
        animate(".3s ease", style({
          height: 0,
          overflowY: 'hidden',
          paddingTop: 0,
          paddingBottom: 0,
        }))
      ])
    ])
  ],
  template: `
    <ng-template #runCard>
      <div class="card margin-y">
        <div class="card-block d-flex justify-content-between align-items-center">
          <div>
            <button [disabled]="!testSuite" class="btn btn-success" (click)="runSuite(testSuite)">
              <sc-icon icon="fa-play-circle">Run {{runWithText | async}}</sc-icon>
            </button>
            <sc-loading for="runTest" displayAs="spinner">
              Preparing execution.
            </sc-loading>
          </div>
          <div *ngIf="!showConfiguration">
            <button class="btn btn-link" (click)="toggleConfiguration()">Configure</button>
          </div>
        </div>
        <div class="card-block" *ngIf="showConfiguration" [@openConfig]="showConfiguration">
          <run-configuration
            [testSuite]="testSuite"
            [config]="runConfiguration$ | async"
            [containerTags]="containerTags$ | async"
            [sakuliContainers]="sakuliContainer$ | async"
            (cancel)="onCancelConfiguration()"
            (save)="onSaveConfiguration($event)"
            (containerChange)="onContainerChange($event)"
          ></run-configuration>
        </div>
        <div class="card-block" *ngIf="dockerPullStream$ | async; let dockerPullStream">
          <h4>Building Docker image</h4>
          <sc-logs>
            <ng-container *ngFor="let stream of dockerPullStream">{{stream}}</ng-container>
          </sc-logs>
        </div>
        <div class="card-block" *ngIf="dockerPullInfo$ | async; let dockerPullInfos">
          <h4>Pulling Docker image</h4>
          <ng-container
            *ngFor="let dockerPullInfo of dockerPullInfos"
          >
            <docker-pull-info-component
              [dockerPullInfo]="dockerPullInfo"
            >
            </docker-pull-info-component>
          </ng-container>
        </div>
      </div>
    </ng-template>
    <div *ngIf="suiteIsRunning$ | async; else runCard" class="card p-3 mb-3">
      <div class="card-content">
        <sc-icon icon="fa-spinner" [spin]="true"></sc-icon>
        Test suite is running in container {{(testSuiteExecutionInfo$ | async)?.containerId}}
      </div>
    </div>
    <ng-container *ngIf="suiteIsNotRunning$ | async">
      <sa-report-navigation
        *ngIf="latestResult$ | async; let latestResult"
        class="cursor-pointer"
        (click)="navigateToResult(latestResult)"
        [testResult]="latestResult"
        [navigation]="false"
      ></sa-report-navigation>
      <sa-report-content
        *ngIf="latestResult$ | async; let latestResult"
        [testResult]="latestResult">
      </sa-report-content>
    </ng-container>
    <div class="row" *ngIf="hasLogs$ | async">
      <div class="col-12 mb-2" *ngIf="vncReady$ | async" [@onVnc]="vncReady$ | async">
        <sa-vnc-card
          [testSuite]="testSuite"
        ></sa-vnc-card>
      </div>
      <div class="col-12">
        <sa-log-card
          [testSuite]="testSuite"
        ></sa-log-card>
      </div>
    </div>
  `,
  styles: [`
    sa-log-card {
      height: 400px;
    }

    .card-block {
      padding: .5rem;
    }
  `]
})
export class RunTestSuiteComponent implements OnInit, OnChanges {

  private debounceTime = 250;

  @Input() testSuite: SakuliTestSuite;

  showConfiguration = false;

  runConfiguration$: Observable<RunConfiguration>;
  sakuliContainer$: Observable<SakuliContainer[]>;
  containerTags$: Observable<SakuliContainer[]>;
  dockerPullInfo$: Observable<DockerPullInfo[]>;
  dockerPullStream$: Observable<string[]>;
  isDockerPull$: Observable<boolean>;
  isDockerPullStream$: Observable<boolean>;
  hasLogs$: Observable<boolean>;
  vncReady$: Observable<boolean>;
  suiteIsRunning$: Observable<boolean>;
  testSuiteExecutionInfo$: Observable<TestExecutionEntity>;
  latestResult$: Observable<TestSuiteResult>;
  suiteIsNotRunning$: Observable<boolean>;

  constructor(private store: Store<AppState>,
              readonly route: ActivatedRoute,
              readonly actions$: Actions) {
  }

  dispatchLoadRunConfiguration() {
    this.route.params.map(p => p['suite'])
      .subscribe(s => this.store.dispatch(new LoadRunConfiguration(s)));
  }

  ngOnInit() {
    this.dispatchLoadRunConfiguration();
    this.store.dispatch(new LoadTestResults());
    this.store.dispatch(new LoadSakuliContainer());
    this.actions$.ofType(SAVE_RUN_CONFIGURATION_SUCCESS).subscribe(_ => this.showConfiguration = false);
    this.runConfiguration$ = this.store.select(RunConfigurationSelect.runConfiguration).filter(notNull);
    this.sakuliContainer$ = this.store.select(RunConfigurationSelect.container);
    this.containerTags$ = this.store.select(RunConfigurationSelect.tagsForSelectedContainer);
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

  private initObservablesWithTestSuite(testSuite: SakuliTestSuite) {
    this.latestResult$ = this.store
      .select(testSelectors.testResultsFor(testSuite))
      .do(log(this.testSuite.id))
      .filter(r => !!r && !!r.length)
      .map(r => r[0]);

    this.testSuiteExecutionInfo$ = this.store
      .select(testExecutionSelectors.latestByTestSuite(testSuite));

    this.vncReady$ = this.testSuiteExecutionInfo$
      .map(te => te.vncReady)
    ;
    this.suiteIsRunning$ = this.testSuiteExecutionInfo$
      .map(te => te ? te.isRunning : false)
    ;
    this.suiteIsNotRunning$ = this.testSuiteExecutionInfo$
      .map(ir => !ir)
    ;
    this.dockerPullInfo$ = this.store
      .select(dockerPullInfoForCurrentRunInfoAsArray(testSuite))
      .debounceTime(this.debounceTime);
    this.isDockerPull$ = this.dockerPullInfo$.map(s => !!s);
    this.dockerPullStream$ = this.store
      .select(dockerPullStreamForCurrentRunInfo(testSuite))
      .debounceTime(this.debounceTime);
    this.isDockerPullStream$ = this.dockerPullStream$.map(s => !!s && !!s.length).distinctUntilChanged();
    this.hasLogs$ = this.store.select(
      testExecutionLogSelectors.latestForTestSuite(testSuite)
    ).map(l => !!l && !!l.length);
  }


  runSuite(testSuite: SakuliTestSuite) {
    this.store.dispatch(new RunTest(testSuite));
  }

  toggleConfiguration() {
    this.showConfiguration = !this.showConfiguration;
    if (this.showConfiguration) {
      this.dispatchLoadRunConfiguration();
    }
  }

  onCancelConfiguration() {
    this.showConfiguration = false;
  }

  onSaveConfiguration($event: RunConfiguration) {
    this.route.params.map(p => p['suite']).first()
      .subscribe(path => this.store.dispatch(new SaveRunConfiguration(path, $event)));
  }

  onContainerChange($event: SakuliContainer) {
    this.store.dispatch(new SelectSakuliContainer($event));
  }


  get runWithText() {
    return this.runConfiguration$.map(rc => {
      switch (rc.type as any) {
        case RunConfigurationTypes[RunConfigurationTypes.DockerCompose]:
          return `with docker-compose`;
        case RunConfigurationTypes[RunConfigurationTypes.Dockerfile]:
          return `with Dockerfile`;
        case RunConfigurationTypes[RunConfigurationTypes.Local]:
          return `local`;
        case RunConfigurationTypes[RunConfigurationTypes.SakuliContainer]:
          return `sakuli container`
      }
      return `Cannot map ${rc.type}`;
    })
  }

  navigateToResult(result: TestSuiteResult) {
    this.store.dispatch(new RouterGo({path: ['/reports', result.sourceFile]}))
  }
}
