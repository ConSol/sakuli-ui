import {Component, Input} from "@angular/core";
import {TestSuite} from "../../sweetest-components/services/access/model/test-suite.model";
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {RunTest} from "./state/test.actions";
import {SakuliTestSuite} from "../../sweetest-components/services/access/model/sakuli-test-model";
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
  LogMessage, logsForCurrentRunInfo
} from "./state/test.interface";

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
    <ul class="list-group margin-y">
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <button [disabled]="!testSuite" class="btn btn-success" (click)="runSuite()">
            <sc-icon icon="fa-play-circle">Run {{runWithText | async}}</sc-icon>
          </button>
          <sc-loading for="runTest" displayAs="spinner">
            Preparing execution.
          </sc-loading>
        </div>
        <div *ngIf="!showConfiguration">
          <button class="btn btn-link" (click)="toggleConfiguration()">Configure</button>
        </div>
      </li>
      <li class="list-group-item" *ngIf="showConfiguration" [@openConfig]="showConfiguration">
        <run-configuration
          [project]="project"
          [config]="runConfiguration$ | async"
          [containerTags]="containerTags$ | async"
          [sakuliContainers]="sakuliContainer$ | async"
          (cancel)="onCancelConfiguration()"
          (save)="onSaveConfiguration($event)"
          (containerChange)="onContainerChange($event)"
        ></run-configuration>
      </li>
      <li class="list-group-item" *ngIf="(logs$ | async).length">
        <sc-logs [messages]="logs$ | async">
        </sc-logs>
      </li>
      <li class="list-group-item" *ngIf="isDockerPullStream$ | async" [@openConfig]="isDockerPullStream$ | async">
        <h4>Building Docker image</h4>
        <sc-logs><ng-container *ngFor="let stream of dockerPullStream$ | async">{{stream}}</ng-container></sc-logs>
      </li>
      <li class="list-group-item" *ngIf="isDockerPull$ | async" [@openConfig]="isDockerPull$ | async">
          <h4>Pulling Docker image</h4>
          <ng-container
            *ngFor="let dockerPullInfo of dockerPullInfo$ | async "
          >
            <docker-pull-info-component
              [dockerPullInfo]="dockerPullInfo"
            >
            </docker-pull-info-component>
          </ng-container>
      </li>
    </ul>
  `
})
export class RunTestSuiteComponent {
  @Input() testSuite: TestSuite;
  @Input() project: ProjectModel;

  showConfiguration = false;


  constructor(
    private store: Store<AppState>,
    readonly actions$: Actions
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadRunConfiguration());
    this.store.dispatch(new LoadSakuliContainer());
    this.actions$.ofType(SAVE_RUN_CONFIGURATION_SUCCESS).subscribe(_ => this.showConfiguration = false);
  }

  runSuite() {
    this.store.dispatch(new RunTest(this.testSuite as SakuliTestSuite));
  }

  toggleConfiguration() {
    this.showConfiguration = !this.showConfiguration;
    if(this.showConfiguration) {
      this.store.dispatch(new LoadRunConfiguration());
    }
  }

  onCancelConfiguration() {
    this.showConfiguration = false;
  }

  onSaveConfiguration($event: RunConfiguration) {
    this.store.dispatch(new SaveRunConfiguration($event));
  }

  onContainerChange($event: SakuliContainer) {
    console.log('E', $event);
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
    return this.dockerPullStream$.map(s => !!s && !!s.length);
  }

  get logs$(): Observable<LogMessage[]> {
    return this.store.select(logsForCurrentRunInfo);
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
