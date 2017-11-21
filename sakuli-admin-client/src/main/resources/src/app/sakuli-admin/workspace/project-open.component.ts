import {Component, HostListener} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FileResponse} from '../../sweetest-components/services/access/model/file-response.interface';
import {Tree} from '../../sweetest-components/components/presentation/tree/tree.interface';
import {animate, style, transition, trigger} from "@angular/animations";
import {Store} from "@ngrx/store";
import {WorkspaceState} from "./state/project.interface";
import {LoadPath, Open, SelectFile, ToggleOpen} from "./state/project.actions";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'sa-project-open',
  animations: [
    trigger('showFooter', [
      transition(':enter', [
        style({transform: 'translate3d(0, 100%, 0)'}),
        animate('.35s ease-in', style({transform: 'translate3d(0,0,0)'}))
      ])
    ])
  ],
  template: `
      <div class="modal-header">
        <span>Open Project</span>
        <a (click)="close()" class="cursor-pointer">
          <sc-icon icon="fa-times"></sc-icon>
        </a>
      </div>
      <div class="modal-body">
        <sc-tree [files]="files$ | async" (open)="onOpen($event)" [selected]="selectedFile$ | async"></sc-tree>
      </div>
      <div class="modal-footer d-flex justify-content-between" >
        <span>
          <span>{{(selectedFile$ | async)?.path}}</span>
        </span>
        <button 
                class="btn btn-primary"
                (click)="openProject()"
        >
          Open
        </button>
      </div>
  `,
  styles: [`
    :host() {
      height: 90vh;
      width: 90vw;
    }
  `]
})
export class ProjectOpenComponent {

  files$: Observable<Tree<FileResponse>[]>;
  selectedFile$: Observable<Tree<FileResponse>>;
  projectRootSelected$: Observable<boolean>;

  @HostListener('document:click', ['$event'])
  clickOutside($event: MouseEvent) {
    this.store.dispatch(new SelectFile());
  }

  constructor(
    private modal: NgbActiveModal,
    private store: Store<{ project: WorkspaceState }>,
  ) {
    this.store.dispatch(new LoadPath(''));
    this.files$ = this.store.select(s => s.project.fileTree);
    this.selectedFile$ = this.store.select(s => s.project.selectedFile);
  }

  onOpen(event: Tree<FileResponse>) {
    if (event.directory) {
      this.store.dispatch(new ToggleOpen(event));
    }
    this.store.dispatch(new SelectFile(event));
  }

  close() {
    this.modal.dismiss();
  }

  openProject() {
    this.selectedFile$
      .take(1)
      .subscribe(f => {
        this.store.dispatch(new Open(f));
        this.modal.close(f);
      });
  }

}
