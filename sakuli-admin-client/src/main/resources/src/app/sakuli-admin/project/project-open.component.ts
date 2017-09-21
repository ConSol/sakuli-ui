import {Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output} from '@angular/core';
import {ProjectService} from '../../sweetest-components/services/access/project.service';
import {Observable} from 'rxjs/Observable';
import {FileResponse} from '../../sweetest-components/services/access/model/file-response.interface';
import {Tree} from '../../sweetest-components/components/presentation/tree/tree.interface';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Store} from "@ngrx/store";
import {ProjectState} from "./state/project.interface";
import {LoadPath, Open, SelectFile, ToggleOpen} from "./state/project.actions";
import {Router} from "@angular/router";
import {NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";


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
      <div class="modal-header"
      >
        <span>Open Project</span>
        <a (click)="close()">&times;</a>
      </div>
      <div class="modal-body">
        <sc-tree [files]="files$ | async" (open)="onOpen($event)"></sc-tree>
      </div>
      <div class="modal-footer d-flex justify-content-between" >
        <span>
          <pre>{{(selectedFile$ | async)?.path}}</pre>
        </span>
        <button [disabled]="!(projectRootSelected$ | async)"
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
    private store: Store<{ project: ProjectState }>,
    private router: Router,
  ) {

    const isTestSuite = (f: Tree<FileResponse>) => !f.directory && f.name === 'testsuite.suite';
    const atLeastOne = (a: boolean, c: boolean) => a || c;
    this.store.dispatch(new LoadPath(''));
    this.files$ = this.store.select(s => s.project.fileTree);
    this.selectedFile$ = this.store.select(s => s.project.selectedFile);
    this.projectRootSelected$ = this.selectedFile$
      .combineLatest(this.files$)
      .map(([f]) => f && (isTestSuite(f) || f.children.map(isTestSuite).reduce(atLeastOne, false)))
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
        this.router.navigate(['test'])
      });
  }

}
