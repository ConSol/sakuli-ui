import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {fileSelectorSelectors} from "./file-selector.state";
import {FileSelectorFilter, FileSelectorSort} from "./file-selector-filter.interface";
import {absPath} from "../../../services/access/model/file-response.interface";
import {ModalAware} from "../modal/sc-modal.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-file-selector-modal-component',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button class="close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <sc-file-selector-component
        [root]="root"
        [inactive]="inactive"
        [hide]="hide"
      >
      </sc-file-selector-component>
    </div>
    <div class="modal-footer d-flex justify-content-between">
      <div>
        {{selectedFilesOut$ | async}}
      </div>
      <div>
        <button class="btn btn-default" (click)="cancel()">Cancel</button>
        <button [disabled]="okButtonDisabled$ | async" class="btn btn-success" (click)="close()">{{okButtonText}}</button>
      </div>
    </div>
  `,
  styles: [`
    
    .modal-body {
      overflow: auto;
    }

    .modal-footer {
      display: flex;
      flex-direction: row;
    }
  `]
})

export class ScFileSelectorModalComponent implements ModalAware {
  getActiveModal(): NgbActiveModal {
    return this.modal;
  }


  @Input() title: string = "Select a file";
  @Input() okButtonText: string = "Ok";
  @Input() root: string;
  @Input() hide: FileSelectorFilter;
  @Input() inactive: FileSelectorFilter;
  @Input() sort: FileSelectorSort;

  selectedFiles$ = this.store
    .select(fileSelectorSelectors.selectedFiles);

  selectedFilesOut$ = this.selectedFiles$.map(files => files.map(absPath).join(', '));

  okButtonDisabled$ = this.selectedFiles$.map(files => !files.length);

  constructor(
    readonly modal: NgbActiveModal,
    readonly store: Store<any>
  ) {  }



  close() {
    this.selectedFiles$.first().subscribe(f => {
      this.modal.close(f);
    })
  }

  cancel() {
    this.modal.dismiss();
  }

}
