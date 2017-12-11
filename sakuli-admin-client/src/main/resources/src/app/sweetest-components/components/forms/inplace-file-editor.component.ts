import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileService} from "../../services/access/file.service";
import {ScToastService} from "../presentation/toast/toast.service";
import {getModeForPath} from "./editor/modelist";
import {DangerToast, SuccessToast} from "../presentation/toast/toast.model";
import {ScFileSelectorService} from "../presentation/file-selector/sc-file-selector.service";
import {absPath} from "../../services/access/model/file-response.interface";
import * as path from 'path';
import {FileSelectorFilter} from "../presentation/file-selector/file-selector-filter.interface";

@Component({
  selector: 'inplace-file-editor',
  template: `
    <sc-editor [(ngModel)]="content" [mode]="mode">
      <nav class="navbar top justify-content-start p-0">
        <button 
          class="btn btn-sm" 
          (click)="openFile()"
          [ngbTooltip]="'Select another file'"
          container="body"
        >
          <sc-icon icon="fa-folder-open-o"></sc-icon>
        </button>
        <span>
          {{file}}
        </span>
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
  @Input() hide: FileSelectorFilter;
  @Input() inactive: FileSelectorFilter;

  @Output() fileChanged = new EventEmitter<string>();

  content: string | null;

  constructor(readonly fileService: FileService,
              readonly toasts: ScToastService,
              readonly changeDetector: ChangeDetectorRef,
              readonly fileSelectorService: ScFileSelectorService) {
  }

  async openFile() {
    console.log(this.inactive);
    try {
      const [file] = await this.fileSelectorService.openModal({
        root: this.root,
        hide: this.hide,
        inactive: this.inactive
      });
      this.file = absPath(file);
      this.fileChanged.next(this.file);
      this.refresh();
    } catch (e) {
      console.info('Modal closed without selection');
    }
  }

  refresh() {
    this.fileService.read(`${this.file}`)
      .subscribe(
        dc => {
          this.content = dc;
          this.changeDetector.detectChanges();
        },
        e => {
          const reader = new FileReader();
          reader.readAsText(this.defaultFile);
          reader.onloadend = () => this.content = reader.result;
          console.log('e', this.content);
        },
        () => this.changeDetector.detectChanges())
  }

  ngOnInit() {
    if (!this.mode) {
      this.mode = getModeForPath(this.file).name;
    }
    this.refresh();
  }

  save() {
    const baseName = path.basename(this.file);
    const dir = path.dirname(this.file);
    return this.fileService
      .write(dir, new File([this.content], baseName))
      .map(_ => this.file)
      ;
  }

}
