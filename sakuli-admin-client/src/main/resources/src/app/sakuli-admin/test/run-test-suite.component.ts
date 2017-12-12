import {Component, Input} from "@angular/core";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {RunTest} from "./state/test.actions";
import {SakuliTestCase, SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";
import {animate, style, transition, trigger} from "@angular/animations";
import {ProjectModel} from "../../sweetest-components/services/access/model/project.model";
import {
  RunConfiguration, RunConfigurationSelect, SakuliContainer
} from "./run-configuration/run-configuration.interface";
import {
  LoadRunConfiguration, LoadSakuliContainer, SAVE_RUN_CONFIGURATION_SUCCESS,
  SaveRunConfiguration,
  SelectSakuliContainer
} from "./run-configuration/run-configuration.actions";
import {Observable} from "rxjs/Observable";
import {RunConfigurationTypes} from "./run-configuration/run-configuration-types.enum";
import {notNull} from "../../core/redux.util";
import {Actions} from "@ngrx/effects";
import {
  DockerPullInfo, dockerPullInfoForCurrentRunInfoAsArray, dockerPullStreamForCurrentRunInfo,
  logsForCurrentRunInfo
} from "./state/test.interface";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'run-test-suite',
  animations: [
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
      <div class="card-block" *ngIf="isDockerPullStream$ | async" [@openConfig]="isDockerPullStream$ | async">
        <h4>Building Docker image</h4>
        <sc-logs>
          <ng-container *ngFor="let stream of dockerPullStream$ | async">{{stream}}</ng-container>
        </sc-logs>
      </div>
      <div class="card-block" *ngIf="isDockerPull$ | async" [@openConfig]="isDockerPull$ | async">
        <h4>Pulling Docker image</h4>
        <ng-container
          *ngFor="let dockerPullInfo of dockerPullInfo$ | async "
        >
          <docker-pull-info-component
            [dockerPullInfo]="dockerPullInfo"
          >
          </docker-pull-info-component>
        </ng-container>
      </div>
    </div>
    <div class="row" *ngIf="hasLogs$ | async">
      <div class="col-12">
        <sa-log-card></sa-log-card>
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
export class RunTestSuiteComponent {
  @Input() testSuite: SakuliTestSuite;

  showConfiguration = false;

  constructor(
    private store: Store<AppState>,
    readonly route: ActivatedRoute,
    readonly actions$: Actions
  ) {}

  dispatchLoadRunConfiguration() {
    this.route.params.map(p => p['suite'])
      .subscribe(s => this.store.dispatch(new LoadRunConfiguration(s)));
  }

  ngOnInit() {
    this.dispatchLoadRunConfiguration();
    this.store.dispatch(new LoadSakuliContainer());
    this.actions$.ofType(SAVE_RUN_CONFIGURATION_SUCCESS).subscribe(_ => this.showConfiguration = false);
  }

  runSuite(testSuite: SakuliTestSuite) {
    this.store.dispatch(new RunTest(testSuite));
  }

  toggleConfiguration() {
    this.showConfiguration = !this.showConfiguration;
    if(this.showConfiguration) {
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

  get runConfiguration$(): Observable<RunConfiguration> {
    return this.store.select(RunConfigurationSelect.runConfiguration).filter(notNull);
  }

  get sakuliContainer$(): Observable<SakuliContainer[]> {
    return this.store.select(RunConfigurationSelect.container);
  }

  get containerTags$(): Observable<SakuliContainer[]> {
    return this.store.select(RunConfigurationSelect.tagsForSelectedContainer);
  }

  get dockerPullInfo$(): Observable<DockerPullInfo[]> {
    return this.store.select(dockerPullInfoForCurrentRunInfoAsArray);
  }

  get isDockerPull$(): Observable<boolean> {
    return this.dockerPullInfo$.map(s => !!s);
  }

  get dockerPullStream$(): Observable<string[]> {
    return this.store.select(dockerPullStreamForCurrentRunInfo);
  }

  get isDockerPullStream$(): Observable<boolean> {
    return this.dockerPullStream$.map(s => !!s && !!s.length).distinctUntilChanged();
  }

  get hasLogs$(): Observable<boolean> {
    return this.store.select(logsForCurrentRunInfo).map(l => !!l && !!l.length).distinctUntilChanged();
  }

  get runWithText() {
    return this.runConfiguration$.map(rc => {
      switch(rc.type as any) {
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
}
