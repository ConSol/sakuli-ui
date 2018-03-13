import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RunConfigurationTypes} from "./run-configuration-types.enum";
import {ContainerTag, RunConfiguration, SakuliContainer} from "./run-configuration.interface";
import {InplaceFileEditorComponent} from "../../../sweetest-components/components/forms/inplace-file-editor.component";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {workspaceSelectors} from "../../workspace/state/project.interface";
import * as path from 'path';
import {AppInfoService} from "../../../sweetest-components/services/access/app-info.service";
import {LoadSakuliContainer} from "./run-configuration.actions";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'run-configuration',
  template: `
    <sc-loading class="d-block margin-y" #loadingCmp displayAs="progressbar" for="runconfig"></sc-loading>
    <form *ngIf="info.getAppInfo() | async; let appInfo">
      <fieldset class="form-group" *ngIf="!(loadingCmp.show$ | async) && !!config">
        <legend>Run Configuration</legend>
        <div class="form-check" *ngIf="appInfo.localExecutionEnabled">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.Local]"/>
            Local execution
          </label>
        </div>
        <div class="form-check" *ngIf="appInfo.dockerContainerExecutionEnabled">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.SakuliContainer]"/>
            Run in Sakuli-Container
          </label>
          <div *ngIf="config.type === types[types.SakuliContainer]" class="config-area margin-y">
            <div class="input-group input-group-sm mb-3 container-selection">
              <span class="input-group-prepend">
                [Container]:[Tag]
                <sc-loading for="sakuli-container" #loadingContainer></sc-loading>
              </span>
              <div>
                <select *ngIf="!(loadingContainer.show$ | async)"
                        [(ngModel)]="config.sakuli.container"
                        (change)="containerChange.next(config.sakuli.container)"
                        [ngModelOptions]="{standalone: true}"
                        class="custom-select"
                >
                  <option *ngFor="let c of sakuliContainers" [ngValue]="c">{{c.name}}</option>
                </select>
                <label class="input-group-addon">:</label>
                <sc-loading for="tags" #loadingTags></sc-loading>
                <select *ngIf="!(loadingTags.show$ | async)"
                        [(ngModel)]="config.sakuli.tag"
                        [ngModelOptions]="{standalone: true}"
                        class="custom-select"
                >
                  <option *ngFor="let t of containerTags" [ngValue]="t">{{t.name}}</option>
                </select>
              </div>
            </div>
            <h5>Environment Variables</h5>
            <key-value-list
              [(ngModel)]="config.sakuli.environment"
              [ngModelOptions]="{standalone: true}"
            ></key-value-list>
          </div>
          <pre>{{config.sakuli | json}}</pre>
        </div>
        <div class="form-check" *ngIf="appInfo.dockerComposeExecutionEnabled">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.DockerCompose]"/>
            Run with <code>docker-compose</code>
          </label>
          <div *ngIf="config.type === types[types.DockerCompose]" class="config-area margin-y">
            <inplace-file-editor
              [showNav]="true"
              [root]="workspace$ | async"
              [file]="dockerComposeFile"
              mode="yaml"
              [defaultFile]="defaultDockerComposeFile"
              #dockerComposeFileEditor
            ></inplace-file-editor>
          </div>
        </div>
        <div class="form-check" *ngIf="appInfo.dockerFileExecutionEnabled">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.Dockerfile]"/>
            Run with <code>dockerfile</code>
          </label>
          <div *ngIf="config.type === types[types.Dockerfile]" class="config-area margin-y">
            <inplace-file-editor
              [showNav]="true"
              [root]="workspace$ | async"
              [file]="dockerFile"
              mode="dockerfile"
              [defaultFile]="defaultDockerFile"
              #dockerFileEditor
            ></inplace-file-editor>
          </div>
        </div>
      </fieldset>
      <div class="form-group d-flex justify-content-end">
        <button class="btn btn-link" (click)="cancel.next(); $event.preventDefault()">Cancel</button>
        <button class="btn btn-primary" (click)="onSave($event, config)">Save</button>
      </div>
    </form>
  `,
  styles: [`
    .config-area {
      padding-left: 1.25rem;
    }

    .container-selection select {
      flex-grow: 1;
    }
  `]
})

export class RunConfigurationComponent {
  types = RunConfigurationTypes;

  @Input() config: RunConfiguration;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<RunConfiguration>();
  @Output() containerChange = new EventEmitter<SakuliContainer>();

  @Input() testSuite: SakuliTestSuite;

  @Input() sakuliContainers: SakuliContainer[];
  @Input() containerTags: ContainerTag[];

  selectedContainer: SakuliContainer;

  _dockerFile: string;
  _dockerComposeFile: string;

  keys = Object.keys;

  defaultDockerComposeFile = new File([`version: '2'
services:
  sakuli_test:
    image: consol/sakuli-ubuntu-xfce
  `], 'docker-compose.yml');

  defaultDockerFile = new File([`FROM consol/sakuli-ubuntu-xfce`], 'Dockerfile');

  @ViewChild('dockerFileEditor')
  dockerFileEditor: InplaceFileEditorComponent;


  @ViewChild(InplaceFileEditorComponent)
  dockerComposeFileEditor: InplaceFileEditorComponent;

  workspace$ = this.store.select(workspaceSelectors.workspace);

  constructor(readonly store: Store<AppState>,
              readonly info: AppInfoService) {
  }

  ngOnInit() {
    this.store.dispatch(new LoadSakuliContainer())
  }

  get dockerFile() {
    return path.resolve(this.testSuite.root, this.config.dockerfile.file)
  }

  get dockerComposeFile() {
    return path.resolve(this.testSuite.root, this.config.dockerCompose.file)
  }

  async onSave($event: MouseEvent, config: RunConfiguration) {
    $event.preventDefault();
    const [dockerFile, dockerComposeFile] = await Promise.all([
      this.saveDockerFile(),
      this.saveDockerComposeFile()
    ]);
    if (dockerFile) {
      config.dockerfile.file = path.relative(this.testSuite.root, dockerFile);
    }
    if (dockerComposeFile) {
      config.dockerCompose.file = path.relative(this.testSuite.root, dockerComposeFile);
    }
    this.save.next(config);
  }

  async saveDockerFile() {
    return RunConfigurationComponent.saveInplaceEditor(this.dockerFileEditor);
  }

  async saveDockerComposeFile() {
    return RunConfigurationComponent.saveInplaceEditor(this.dockerComposeFileEditor);
  }

  static async saveInplaceEditor(editor: InplaceFileEditorComponent) {
    if (editor) {
      return editor.save().toPromise();
    } else {
      return Promise.resolve(null);
    }
  }

}
