import {Component, Input, OnInit} from '@angular/core';
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {project} from "../../project/state/project.interface";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {RefreshProject} from "../../project/state/project.actions";

@Component({
  moduleId: module.id,
  selector: 'sa-configuration',
  template: `
    <sc-content>
      <sc-heading
        [title]="'Configuration'"
        [subTitle]=""
        icon="fa-wrench"
      >
        <!--<sc-icon icon="fa-question-circle"></sc-icon>-->
      </sc-heading>
      <article class="no-gutter d-flex">
        <sc-editor *ngIf="currentFile" [(ngModel)]="currentFile" mode="properties">
          <nav class="navbar bottom d-flex flex-row justify-content-end">
            <button class="btn btn-success" (click)="onSave()">Save</button>
          </nav>
        </sc-editor>
      </article>
    </sc-content>
  `
})

export class SaConfigurationComponent implements OnInit {

  @Input() currentFile;

  constructor(
    private readonly fileService: FileService,
    private readonly store: Store<AppState>,
    private readonly toastService: ScToastService
  ) {
  }

  ngOnInit() {
    this.refresh();
  }

  get project$ () {
    return this.store.select(project).first();
  }

  refresh() {
      this.project$
      .mergeMap(p => this.fileService.read(`${p.path}/testsuite.properties`))
      .subscribe(r => {
        this.currentFile = r;
      }, e => {
        this.toastService.create({
          type: 'danger',
          message: 'Error while loading'
        })
      })
  }

  onSave() {
    this.project$.mergeMap(p => {
      return this.fileService.write(
        p.path,
        new File([this.currentFile], 'testsuite.properties'));
    })
    .subscribe(_ => {
      this.toastService.create({
        type: 'success',
        message: 'Successfully saved configuration'
      });
      this.store.dispatch(new RefreshProject());
      this.refresh();
    }, e => {
      this.toastService.create({
        type: 'danger',
        icon: 'fa-warning',
        message: 'Error while saving configuration',
        more: {
          name: e.name,
          message: e.message,
          stack : e.stack.split('\n')
        }
      })
    })
  }
}
