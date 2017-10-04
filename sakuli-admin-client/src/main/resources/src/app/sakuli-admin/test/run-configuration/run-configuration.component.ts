import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RunConfigurationTypes} from "./run-configuration-types.enum";
import {ContainerTag, RunConfiguration, SakuliContainer} from "./run-configuration.interface";
import {ProjectModel} from "../../../sweetest-components/services/access/model/project.model";
import {InplaceFileEditorComponent} from "./inplace-file-editor.component";

@Component({
  moduleId: module.id,
  selector: 'run-configuration',
  template: `
    <sc-loading class="d-block margin-y" #loadingCmp displayAs="progressbar" for="runconfig"></sc-loading>
    <form>
      <fieldset class="form-group" *ngIf="!(loadingCmp.show$ | async) && config">
        <legend>Run Configuration</legend>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.Local]"/>
            Local execution
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.SakuliContainer]"/>
            Run in Sakuli-Container
          </label>
          <div *ngIf="config.type === types[types.SakuliContainer]" class="config-area margin-y">
            Container:
            <sc-loading for="sakuli-container" #loadingContainer></sc-loading>
            <select *ngIf="!(loadingContainer.show$ | async)" [(ngModel)]="config.sakuli.container"
                    (change)="containerChange.next(config.sakuli.container)" [ngModelOptions]="{standalone: true}">
              <option *ngFor="let c of sakuliContainers" [ngValue]="c">{{c.name}}</option>
            </select>
            Tag:
            <sc-loading for="tags" #loadingTags></sc-loading>
            <select *ngIf="!(loadingTags.show$ | async)" [(ngModel)]="config.sakuli.tag"
                    [ngModelOptions]="{standalone: true}">
              <option *ngFor="let t of containerTags" [ngValue]="t">{{t.name}}</option>
            </select>
          </div>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.DockerCompose]"/>
            Run with <code>docker-compose</code>
          </label>
          <div *ngIf="config.type === types[types.DockerCompose]" class="config-area margin-y">
            <inplace-file-editor
              [project]="project"
              file="docker-compose.yml"
              mode="yaml"
              [defaultFile]="defaultDockerComposeFile"
              #dockerComposeFileEditor
            ></inplace-file-editor>
          </div>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="runType" [(ngModel)]="config.type"
                   [value]="types[types.Dockerfile]"/>
            Run with <code>dockerfile</code>
          </label>
          <div *ngIf="config.type === types[types.Dockerfile]" class="config-area margin-y">
            <inplace-file-editor
              [project]="project"
              file="dockerfile"
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
  `]
})

export class RunConfigurationComponent {
  types = RunConfigurationTypes;

  @Input() config: RunConfiguration;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<RunConfiguration>();
  @Output() containerChange = new EventEmitter<SakuliContainer>();

  @Input() project: ProjectModel;

  @Input() sakuliContainers: SakuliContainer[];
  @Input() containerTags: ContainerTag[];

  selectedContainer: SakuliContainer;


  defaultDockerComposeFile = new File([`version: '2'
services:
  sakuli_test:
    image: consol/sakuli-ubuntu-xfce
  `],'docker-compose.yml');

  defaultDockerFile = new File([`FROM consol/sakuli-ubuntu-xfce`], 'Dockerfile');

  @ViewChild('dockerFileEditor')
  dockerFileEditor: InplaceFileEditorComponent;


  @ViewChild(InplaceFileEditorComponent)
  dockerComposeFileEditor: InplaceFileEditorComponent;

  constructor(
  ) {
  }

  ngOnInit() {

  }

  async onSave($event: MouseEvent, config: RunConfiguration) {
    $event.preventDefault();
    await Promise.all([
      this.saveDockerFile(),
      this.saveDockerComposeFile()
    ]);
    this.save.next(config);
  }

  async saveDockerFile() {
    if(this.dockerFileEditor) {
      return this.dockerFileEditor.save().toPromise();
    } else {
      return Promise.resolve(0);
    }
  }

  async saveDockerComposeFile() {
    if(this.dockerComposeFileEditor) {
      return this.dockerComposeFileEditor.save().toPromise();
    } else {
      return Promise.resolve(0);
    }
  }

}
