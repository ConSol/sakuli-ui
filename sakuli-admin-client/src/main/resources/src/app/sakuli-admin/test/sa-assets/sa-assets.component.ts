import {
  Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild
} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SakuliTestCase} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {absPath, FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";

export interface UploadEvent {
  files: FileList,
  targetFolder: string;
}

@Component({
  selector: 'sa-assets',
  template: `
    <ng-template #folderItem let-folder="result">
      <sc-icon icon="fa-folder"><span class="text-muted">{{folder.path}}</span>/{{folder.name}}</sc-icon>
    </ng-template>
    <sc-content>
      <header>
        <form class="form margin-y d-flex flex-row ">
          <div class="input-group shade">
            <div class="input-group-addon point-cursor">
              <sc-icon icon="fa-folder"></sc-icon>
            </div>
            <div class="form-control d-flex flex-row justify-content-start">
              <a [routerLink]="['/testsuite', testSuitePath ,'assets']">
                ~
              </a>
              <ng-container *ngFor="let part of currentFolderParts; let i = index">
                /
                <a [routerLink]="['/testsuite', testSuitePath, 'assets']|concat:(currentFolderParts|slice:0:i+1).join('/')">
                  {{part}}
                </a>
              </ng-container>
            </div>
            <label class="input-group-addon" [for]="fileUploadId">
              <sc-icon icon="fa-upload"></sc-icon>
            </label>
          </div>
          <input
            #fileUploadInput
            [id]="fileUploadId"
            (change)="handleUpload(fileUploadInput.files)"
            [multiple]="true"
            type="file"
          >
        </form>
      </header>
      <article #articleElement>
        <div *ngIf="dragOver" class="overlay border-success">
        </div>
        <sa-assest-items
          [items]="targetFolders"
          [basePath]="basePath"
          (select)="onFileSelect($event)"
          (delete)="onDelete($event)"
        ></sa-assest-items>
      </article>
      <footer *ngIf="uploading.length">
        <span *ngIf="uploading.length">
          <sc-icon icon="fa-spinner" [rotate]="true">Uploading {{uploading.length}} files...</sc-icon>
        </span>
      </footer>
    </sc-content>

  `,
  styles: [`
    :host {
      height: 100%;
    }
    
    header {
      background: transparent;
    }

    label {
      margin: 0;
    }

    input[type="file"] {
      display: none;
    }

    article {
      flex-grow: 1;
    }

    .overlay {
      position: absolute; /* Sit on top of the page content */
      display: block; /* Hidden by default */
      width: 100%; /* Full width (cover the whole page) */
      height: 100%; /* Full height (cover the whole page) */
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5); /* Black background with opacity */
      border: 5px dashed;
      z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    }
  `]
})
export class SaAssetsComponent implements OnInit {

  @ViewChild('articleElement')
  private articleElement: ElementRef;

  @HostBinding('class')
  get hostClass() {
    return 'd-flex flex-column'
  }

  fileUploadId = 'sa-assets-item-upload';

  @Input() basePath = 'api/files';
  @Input() testCase: SakuliTestCase = null;

  @Input() targetFolders: FileResponse[] = [];
  @Input() currentFolder: string = null;

  @Input() uploading: string[] = [];

  get currentFolderParts() {
    return (this.currentFolder || '')
      .replace(this.testSuitePath, '')
      .split('/')
      .filter(p => p && p.length);
  }

  @Output() upload = new EventEmitter<UploadEvent>();
  @Output() delete = new EventEmitter<FileResponse>();

  @Output() fileSelected = new EventEmitter<FileResponse>();
  onFileSelect(file: FileResponse) {
    this.fileSelected.next(file);
  }

  targetFolders$: Observable<FileResponse[]>;

  targetFolder: FileResponse;

  dragOver = false;

  preventDragBehaviour($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:paste', ['$event'])
  handlePastedData($event: ClipboardEvent) {
    if($event.clipboardData.files) {
      this.handleUpload($event.clipboardData.files);
    }
  }

  @HostListener('dragOver', ['$event'])
  onDragover($event: DragEvent) {
    this.preventDragBehaviour($event);
    $event.dataTransfer.dropEffect = 'copy';
    this.dragOver = true;
  }

  @HostListener('dragenter', ['$event'])
  onDragenter($event: DragEvent) {
    this.preventDragBehaviour($event);
    this.dragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragleave($event: DragEvent) {
    this.preventDragBehaviour($event);
    const {clientX, clientY} = $event;
    const {left, top, right, bottom} = (this.articleElement.nativeElement as HTMLElement).getBoundingClientRect();
    if(
      (clientY > top && clientY < bottom) &&
      (clientX > left && clientX < right)
    ) {
    } else {
      this.dragOver = false;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    //this.preventDragBehaviour($event);
    this.dragOver = false;
    if ($event.dataTransfer.files) {
      this.handleUpload($event.dataTransfer.files);
    }
  }

  constructor(private filesService: FileService,
              private modalService: NgbModal,
  ) {
  }

  get testSuitePath() {
    return this.basePath
  }

  onDelete(file: FileResponse) {
    this.delete.next(file);
  }

  handleUpload(files: FileList) {
    this.upload.next({files, targetFolder: this.currentFolder})
  }

  ngOnInit() {
      this.targetFolders$ = this.filesService.files(this.basePath)
        .mergeMap(files => Observable.from(files))
        .expand(file => file.directory ? this.filesService
          .files(absPath(file))
          .mergeMap(files => Observable.from(files)) : Observable.empty()
        )
        .filter(file => file.directory)
        .reduce((list, file) => [...list, file], [])
        .map(folders => folders.sort((f1, f2) => absPath(f1).localeCompare(absPath(f2))))
      ;
      this.targetFolders$.first().subscribe(tf => this.targetFolder = tf[0])
  }
}
