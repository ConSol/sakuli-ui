import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";
import {
  RunConfiguration,
  RunConfigurationSelect,
  SakuliContainer
} from "./run-configuration/run-configuration.interface";
import {
  LoadRunConfiguration,
  LoadSakuliContainer,
  SAVE_RUN_CONFIGURATION_SUCCESS,
  SaveRunConfiguration,
  SelectSakuliContainer
} from "./run-configuration/run-configuration.actions";
import {Observable} from "rxjs/Observable";
import {RunConfigurationTypes} from "./run-configuration/run-configuration-types.enum";
import {notNull} from "../../core/redux.util";
import {Actions} from "@ngrx/effects";
import {
  DockerPullInfo,
  dockerPullInfoForCurrentRunInfoAsArray,
  dockerPullStreamForCurrentRunInfo,
  testSelectors,
} from "./state/test.interface";
import {ActivatedRoute} from "@angular/router";
import {RunTest, TestExecutionEntity, testExecutionSelectors} from "./state/testexecution.state";
import {testExecutionLogSelectors} from "./state/test-execution-log.state";
import {testSuiteSelectId} from "./state/testsuite.state";
import {TestSuiteResult} from "../../sweetest-components/services/access/model/test-result.interface";
import {LoadTestResults, StopTestExecution} from "./state/test.actions";
import {RouterGo} from "../../sweetest-components/services/router/router.actions";
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'run-test-suite',
  template: `
    <ng-template #runConfigurationTemplate>
      <run-configuration
        [testSuite]="testSuite"
        [config]="runConfiguration$ | async"
        [containerTags]="containerTags$ | async"
        [sakuliContainers]="sakuliContainers$ | async"
        (cancel)="onCancelConfiguration()"
        (save)="onSaveConfiguration($event)"
        (containerChange)="onContainerChange($event)"
      ></run-configuration>
    </ng-template>
    <ng-template #runCard>
      <div class="card margin-y">
        <div class="card-block d-flex justify-content-between align-items-center">
          <div>
            <button [disabled]="!testSuite || !(isValid$ | async)" class="btn btn-success"
                    (click)="runSuite(testSuite)">
              <sc-icon icon="fa-play-circle">Run {{runWithText | async}}</sc-icon>
            </button>
            <span class="text-danger" *ngIf="!(isValid$ | async)">Configuration is not valid</span>
            <sc-loading for="runTest" displayAs="spinner">
              Preparing execution.
            </sc-loading>
          </div>
          <div>
            <button class="btn btn-link" (click)="toggleConfiguration()">Configure</button>
          </div>
        </div>
      </div>
    </ng-template>
    <div *ngIf="suiteIsRunning$ | async; else runCard" class="card p-3 mb-3">
      <div class="card-content" *ngIf="testSuiteExecutionInfo$ | async; let testSuiteExecutionInfo">
        <p>
          <sc-icon icon="fa-spinner" [spin]="true"></sc-icon>
          <ng-container [ngSwitch]="(runConfiguration$ | async)?.type">
            <span *ngSwitchCase="types[types.SakuliContainer]">
              Test suite is running in container {{testSuiteExecutionInfo.containerId}}
            </span>
            <span *ngSwitchCase="types[types.Dockerfile]">
             Test suite is running in container {{testSuiteExecutionInfo.containerId}}
            </span>
            <span *ngSwitchCase="types[types.Local]">
              Test suite is running local
            </span>
            <span *ngSwitchCase="types[types.DockerCompose]">
              Test suite is running with local docker compose
            </span>
            <span *ngSwitchDefault>Test suite is running</span>
          </ng-container>
        </p>
        <button class="btn btn-danger" (click)="stopExecution(testSuiteExecutionInfo?.executionId)">
          <sc-icon icon="fa-ban"> Stop execution</sc-icon>
        </button>
      </div>
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
    <ng-container *ngIf="suiteIsNotRunning$ | async">
      <ng-container *ngIf="latestResult$ | async; let latestResult">
        <h4>Latest report:</h4>
        <sa-report-navigation
          class="cursor-pointer"
          (click)="navigateToResult(latestResult)"
          [testResult]="latestResult"
          [navigation]="false"
        ></sa-report-navigation>
        <sa-report-content
          [testResult]="latestResult$ | async"
          class="mb-3 d-block"
        ></sa-report-content>
      </ng-container>
    </ng-container>
    <div class="row" *ngIf="hasLogs$ | async">
      <div class="col-12 mb-2" *ngIf="vncReady$ | async">
        <ng-container *ngFor="let ports of (testSuiteExecutionInfo$ | async)?.testRunInfoPortList">
          <sa-vnc-card
            [vncPort]="ports.vnc"
            [webPort]="ports.web"
          ></sa-vnc-card>
        </ng-container>
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

  initOverlay(): any {
    this.overlayRef = this.overlay.create(new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    }));
  }

  types = RunConfigurationTypes;

  private debounceTime = 250;

  @Input() testSuite: SakuliTestSuite;

  @ViewChild("runConfigurationTemplate") runConfigurationTemplate: TemplateRef<any>;

  showConfiguration = false;

  isValid$: Observable<string | boolean>;
  runConfiguration$: Observable<RunConfiguration>;
  sakuliContainers$: Observable<SakuliContainer[]>;
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
  private overlayRef: OverlayRef;

  constructor(private store: Store<AppState>,
              readonly route: ActivatedRoute,
              readonly overlay: Overlay,
              readonly vcr: ViewContainerRef,
              readonly actions$: Actions) {
  }

  dispatchLoadRunConfiguration() {
    this.route.queryParamMap.map(p => p.get('suite'))
      .subscribe(s => this.store.dispatch(new LoadRunConfiguration(s)));
  }

  ngOnInit() {
    this.dispatchLoadRunConfiguration();
    this.store.dispatch(new LoadTestResults());
    this.store.dispatch(new LoadSakuliContainer());
    this.actions$.ofType(SAVE_RUN_CONFIGURATION_SUCCESS).subscribe(_ => this.showConfiguration = false);
    this.runConfiguration$ = this.store.select(RunConfigurationSelect.runConfiguration).filter(notNull);
    this.sakuliContainers$ = this.store.select(RunConfigurationSelect.containers);
    this.containerTags$ = this.store.select(RunConfigurationSelect.tagsForSelectedContainer);
    this.isValid$ = this.store.select(RunConfigurationSelect.isValid);
    this.initObservablesWithTestSuite(this.testSuite);
    this.initOverlay();
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
    this.suiteIsNotRunning$ = this.suiteIsRunning$
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
    )
      .map(tr => !!tr.length)

  }


  runSuite(testSuite: SakuliTestSuite) {
    this.store.dispatch(new RunTest(testSuite));
  }

  async toggleConfiguration() {
    this.showConfiguration = !this.showConfiguration;
    if (!this.overlayRef.hasAttached()) {
      const tplPortal = new TemplatePortal(this.runConfigurationTemplate, this.vcr)
      this.overlayRef.attach(tplPortal);
    } else {
      this.overlayRef.dispose();
      this.initOverlay();
    }
  }

  async onCancelConfiguration() {
    await this.toggleConfiguration();
  }

  onSaveConfiguration($event: RunConfiguration) {
    this.route.queryParamMap.map(p => p.get('suite')).first()
      .subscribe(path => this.store.dispatch(new SaveRunConfiguration(path, $event)));
  }

  onContainerChange($event: SakuliContainer) {
    this.store.dispatch(new SelectSakuliContainer($event));
  }

  stopExecution(containerId: string) {
    this.store.dispatch(new StopTestExecution(containerId))
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
