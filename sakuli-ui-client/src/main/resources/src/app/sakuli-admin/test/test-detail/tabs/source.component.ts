import {Component, HostListener, Input, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {FileService} from "../../../../sweetest-components/services/access/file.service";
import {SakuliTestCase, SakuliTestSuite} from "../../../../sweetest-components/services/access/model/sakuli-test-model";
import {ScToastService} from "../../../../sweetest-components/components/presentation/toast/toast.service";
import {SourceForm} from "./source-form.class";
import {FormBaseComponent} from "../../../../sweetest-components/components/forms/form-base-component.interface";
import {AppState} from "../../../appstate.interface";
import {Store} from "@ngrx/store";
import {UpdateTestsuite} from "../../state/testsuite.state";
import {getModeForPath} from "../../../../sweetest-components/components/forms/editor/modelist";
import {DangerToast, SuccessToast} from "../../../../sweetest-components/components/presentation/toast/toast.model";

@Component({
  selector: 'sa-source',
  template: `
    <form [formGroup]="sourceForm" *ngIf="sourceForm" class="d-flex flex-column">
      <sc-editor formControlName="source" [mode]="mode">
        <nav class="navbar bottom d-flex flex-row justify-content-end mx-0 px-0">
          <div class="input-group-wrapper mr-3">
            <div class="input-group"
                 [ngClass]="{'is-invalid': sourceForm.hasInvalidUrl}">
              <div class="input-group-prepend">
                <span class="input-group-text">Starturl:</span>
              </div>
              <input type="text"
                     class="form-control"
                     formControlName="startUrl">
              <span class="input-group-addon"
                    *ngIf="sourceForm.hasInvalidUrl"
              >
                <sc-icon icon="fa-exclamation-triangle">Invalid format</sc-icon>
              </span>
            </div>
          </div>
          <button
            [disabled]="sourceForm.hasInvalidUrl"
            class="btn btn-success"
            (click)="onSave()"
            [disabled]="sourceForm.pristine"
          >Save
          </button>
        </nav>
      </sc-editor>
    </form>
  `,
  styles: [`
    .input-group-wrapper {
      flex-grow: 1;
    }

    sc-editor {
      width: 100%;
      flex-grow: 1;
    }

    form {
      flex-grow: 1;
    }
  `]
})
export class SaSourceComponent implements OnInit, FormBaseComponent {
  @Input() testCase: SakuliTestCase;
  @Input() testSuite: SakuliTestSuite;

  mode: string = 'javascript';

  file$: Observable<{ file: string, content: string }>;
  currentFile: { file: string, content: string };
  sourceForm: SourceForm;

  constructor(private fileService: FileService,
              private toastsService: ScToastService,
              private store: Store<AppState>) {
  }

  @HostListener('document:keydown', ['$event'])
  onHostKeyDown($event: KeyboardEvent) {
    if (($event.key == 's' || $event.key == 'S' ) && ($event.ctrlKey || $event.metaKey)) {
      $event.preventDefault();
      this.onSave();
      return false;
    }
    return true;
  }

  getForm() {
    return this.sourceForm;
  }

  onSave() {
    this.fileService
      .write(
        this.currentFile.file.split('/').slice(0, -1).join('/'),
        new File(
          [this.sourceForm.source],
          this.currentFile.file.split('/').pop()
        )
      )
      .subscribe(r => {
        this.toastsService.create(new SuccessToast(`Successfully saved ${this.currentFile.file}`))
        this.sourceForm.markAsPristine();
      }, e => {
        this.toastsService.create(new DangerToast('Error during saving the file please try again', e))
      });
    const tcIdx = this.testSuite.testCases.findIndex(tc => tc.name + tc.mainFile === this.testCase.name + this.testCase.mainFile);
    this.testSuite.testCases[tcIdx].startUrl = this.sourceForm.startUrl;
    this.store.dispatch(new UpdateTestsuite(this.testSuite));
  }

  ngOnInit() {
    const file = `${this.testSuite.root}/${this.testCase.name}/${this.testCase.mainFile}`;
    this.mode = getModeForPath(this.testCase.mainFile).name;
    this.file$ = this.fileService.read(file).map(content => ({file, content}));
    this.file$.subscribe(file => {
      this.currentFile = file;
      this.sourceForm = new SourceForm(this.currentFile.content, this.testCase.startUrl);
    })
  }
}
