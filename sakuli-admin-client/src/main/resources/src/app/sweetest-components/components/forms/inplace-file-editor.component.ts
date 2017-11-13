import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FileService} from "../../services/access/file.service";
import {ScToastService} from "../presentation/toast/toast.service";
import {getModeForPath} from "./editor/modelist";
import {DangerToast, SuccessToast} from "../presentation/toast/toast.model";

@Component({
  selector: 'inplace-file-editor',
  template: `
    <sc-editor [(ngModel)]="content" [mode]="mode">
      <nav class="navbar top justify-content-start">
        <button class="btn btn-sm"
                (click)="createFile()"
                *ngIf="content === null"
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

  @Input() root: string;
  @Input() file: string;
  @Input() mode: string;
  @Input() defaultFile: File;

  content: string | null;

  constructor(private readonly fileService: FileService,
              private readonly toasts: ScToastService,
              private readonly changeDetector: ChangeDetectorRef
              ) {
  }

  refresh() {
    this.fileService.read(`${this.root}/${this.file}`)
      .subscribe(dc => {
        this.content = dc;
        this.changeDetector.detectChanges();
      }, e => {
        this.content = null;
        console.log('e', this.content);
      })
  }

  ngOnInit() {
    if(!this.mode) {
      this.mode = getModeForPath(this.file).name;
    }
    this.refresh();
  }

  save() {
    return this.fileService
      .write(this.root, new File([this.content], this.file))
    ;
  }

  createFile() {
    this.fileService
      .write(this.root, this.defaultFile)
      .subscribe(
        s => {
          this.toasts
            .create(new SuccessToast('Created a docker-compose.yml in your Project'));
          this.refresh();
        },
        e => this.toasts
          .create(new DangerToast('Unable to create docker-compose.yml', e))
      );

  }
}
