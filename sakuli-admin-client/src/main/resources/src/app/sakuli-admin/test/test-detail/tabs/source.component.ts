import {Component, Input} from "@angular/core";
import {NgbTab} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs/Observable";
import {FileService} from "../../../../sweetest-components/services/access/file.service";
import {TestCase} from "../../../../sweetest-components/services/access/model/test-suite.model";
import {ScToastService} from "../../../../sweetest-components/components/presentation/toast/toast.service";

@Component({
  selector: 'sa-source',
  template: `
    <sc-editor *ngIf="currentFile" [(ngModel)]="currentFile.content">
      <nav class="navbar bottom d-flex flex-row justify-content-end">
        <button class="btn btn-success" (click)="onSave()">Save</button>
      </nav>
    </sc-editor>
  `,
  styles: [`
    sc-editor {
      width: 100%;
    }
  `]
})
export class SaSourceComponent extends NgbTab {
  @Input() testCase: TestCase;

  files$: Observable<{ file: string, content: string }[]>;
  currentFile: { file: string, content: string };

  constructor(
    private fileService: FileService,
    private toastsService: ScToastService
  ) {
    super();
  }

  onSelectFile(file: { file: string, content: string }) {
    this.currentFile = file;
  }

  onSave() {
    this.fileService
      .write(
        this.currentFile.file.split('/').slice(0, -1).join('/'),
        new File(
          [this.currentFile.content],
          this.currentFile.file.split('/').pop()
        )
      ).subscribe(r => {
        this.toastsService.create({
          type:'success',
          message: `Successfully saved ${this.currentFile.file}`
        })
    }, e => {
        this.toastsService.create({
          type: 'danger',
          message: 'Error during saving the file please try again'
        })
    });
  }

  ngOnInit() {
    const sourceFiles = (this.testCase || {} as any).sourceFiles || [];
    console.log(sourceFiles);
    this.files$ = Observable.forkJoin(
      ...sourceFiles.map(file => this.fileService.read(file).map(content => ({file, content})))
    )
    this.files$.subscribe(files => this.currentFile = files[0])
  }
}
