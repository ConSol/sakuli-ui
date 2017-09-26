import {Component, Input, OnInit} from '@angular/core';
import {ProjectModel} from "../../../sweetest-components/services/access/model/project.model";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {
  DangerToast,
  SuccessToast
} from "../../../sweetest-components/components/presentation/toast/toast-state.interface";

@Component({
  moduleId: module.id,
  selector: 'inplace-file-editor',
  template: `
    <sc-editor [(ngModel)]="content" [mode]="mode">
      <nav class="navbar top justify-content-start">
        <button class="btn btn-sm"
                (click)="createFile()"
                *ngIf="project && content === null"
        >
          <sc-icon icon="fa-plus"></sc-icon>
        </button>
        <button class="btn btn-sm">
          <sc-icon icon="fa-folder-open-o"></sc-icon>
        </button>
      </nav>
    </sc-editor>`,
  styles: [`
    :host {
      height: 400px;
      display: flex;
    }
  `]
})

export class InplaceFileEditorComponent implements OnInit {

  @Input() project: ProjectModel;
  @Input() file: string;
  @Input() mode: string;
  @Input() defaultFile: File;

  content: string | null;

  constructor(private readonly fileService: FileService,
              private readonly toasts: ScToastService,) {
  }

  refresh() {
    this.fileService.read(`${this.project.path}/${this.file}`)
      .subscribe(dc => {
        this.content = dc;
      }, e => {
        this.content = null;
      })
  }

  ngOnInit() {
    this.refresh();
  }

  save() {
    return this.fileService
      .write(this.project.path, new File([this.content], this.file))
    ;
  }

  createFile() {
    this.fileService
      .write(this.project.path, this.defaultFile)
      .subscribe(
        s => {
          this.toasts
            .create(new SuccessToast('Created a docker-compose.yml in your Project'))
          this.refresh();
        },
        e => this.toasts
          .create(new DangerToast('Unable to create docker-compose.yml', e))
      );

  }
}
