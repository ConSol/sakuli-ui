import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, Optional, ViewChild} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {InplaceFileEditorComponent} from "../../../sweetest-components/components/forms/inplace-file-editor.component";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {
  DangerToast,
  SuccessToast
} from "../../../sweetest-components/components/presentation/toast/toast-state.interface";

@Component({
  selector: 'sa-text-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-header">
      {{file.name}}
    </div>
    <div class="modal-body m-0 p-0">
      <inplace-file-editor
        [root]="file.path"
        [file]="file.name"
        #editor
      >
      </inplace-file-editor>
    </div>
    <div class="modal-footer d-flex justify-content-between">
      <button type="button" class="btn btn-secondary" (click)="activeModal?.close()">Cancel</button>
      <button type="button" class="btn btn-success" (click)="save()">Save</button>
    </div>
  `,
  styles: [`
    
    .modal-body {
      align-items: center;
      justify-content: center;
      align-content: center;
      text-align: center;
    }

    ul.pagination {
      margin: 0;
    }
  `]
})
export class SaTextModalComponent implements OnInit {

  @ViewChild(InplaceFileEditorComponent)
  inplaceFileEditor: InplaceFileEditorComponent;

  @Input() file: FileResponse;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    readonly toastService: ScToastService
  ) {}

  ngOnInit(): void {

  }

  save() {
    console.log('save', this.inplaceFileEditor);
    this.inplaceFileEditor.save()
      .subscribe(
        _ => this.toastService.create(new SuccessToast(`Saved successfully`)),
        e => this.toastService.create(new DangerToast(`Error while saving`, e))
      )
  }
}
