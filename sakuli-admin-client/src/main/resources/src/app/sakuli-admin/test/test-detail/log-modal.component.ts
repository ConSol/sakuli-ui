import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {Observable} from "rxjs/Observable";
import {notNull} from "../../../core/redux.util";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'sa-vnc-modal',
  template: `
    <div class="modal-body no-gutter">
      <sc-logs #logs class="logs col" *ngIf="view.logs" [follow]="true">
        {{testRunLogs$ | async}}
      </sc-logs>
      <div #iframe class="vnc col" *ngIf="view.vnc">
        <iframe allowfullscreen #iframe [src]="vncSrc$ | async">
          No iframe support...
        </iframe>
      </div>
    </div>
    <div class="modal-footer justify-content-between">
      <div>
        <div class="btn-group cursor-pointer" data-toggle="buttons">
          <label class="btn btn-secondary" ngbButtonLabel [ngClass]="{'active':view.logs}">
            <input type="checkbox" ngbButton [(ngModel)]="view.logs"> Logs
          </label>
          <label class="btn btn-secondary btn-fs" ngbButtonLabel (click)="fullScreen(logs)">
            <sc-icon icon="fa-expand"></sc-icon>
          </label>
        </div>
        <div class="btn-group cursor-pointer" data-toggle="buttons" *ngIf="vncReady$ | async">
          <label class="btn btn-secondary" ngbButtonLabel>
            <input [disabled]="!(vncReady$ | async)" type="checkbox" ngbButton [(ngModel)]="view.vnc"> VNC View
          </label>
          <label class="btn btn-secondary btn-fs" ngbButtonLabel (click)="fullScreen(iframe)">
            <sc-icon icon="fa-expand"></sc-icon>
          </label>
          <label class="btn btn-secondary btn-fs" ngbButtonLabel>
            <a target="_blank"
               *ngIf="vncReady$ | async"
               [href]="vncExtern$ | async"
            >
              <sc-icon icon="fa-external-link"></sc-icon>
            </a>
          </label>
        </div>
      </div>
      <button type="button" class="btn btn-secondary" (click)="close()">
        &times;
      </button>
    </div>
  `,
  styles: [`
    .vnc iframe {
      width: 100%;
      height: 100%;
      border: 0;
      overflow: auto;
    }

    .col {
      padding: 0;
      margin: 0;
      transition: all .35s ease-out;
    }

    .modal-body {
      overflow: hidden !important;
      padding: 0;
      display: flex;
      flex-direction: row;
      width: 95vw;
      height: 95vw;
    }

    .btn-fs:hover /deep/ .fa {
      transform: scale(1.2, 1.2) !important;
    }
  `]
})
export class LogModalComponent {

  @ViewChild('iframe') iframe;
  @ViewChild('logs') logs;

  testRunInfo$: Observable<TestRunInfo>;
  testRunLogs$: Observable<string>;
  vncSrc$: Observable<SafeResourceUrl>;
  vncExtern$: Observable<SafeResourceUrl>;
  vncReady$: Observable<boolean>;

  view = {
    logs: true,
    vnc: false
  };

  fullScreen(elementRef: ElementRef) {
    console.log(elementRef);
    const e = elementRef.nativeElement;
    if (e.requestFullscreen) {
      e.requestFullscreen();
    } else if (e.mozRequestFullscreen) {
      e.mozRequestFullscreen();
    } else if (e.webkitRequestFullscreen) {
      e.webkitRequestFullscreen();
    }
  }

  constructor(public activeModal: NgbActiveModal,
              private store: Store<AppState>,
              private sanitizer: DomSanitizer) {

    this.testRunInfo$ = this.store.select(s => s.test.testRunInfo).filter(notNull).first();
    this.vncSrc$ = this.testRunInfo$
      .map(tri => `http://localhost:${tri.vncWebPort}?password=sakuli`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));

    this.vncExtern$ = this.testRunInfo$
      .map(tri => `vnc://localhost:${tri.vncPort}?password=sakuli`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));

    this.testRunLogs$ = this.testRunInfo$
      .mergeMap(tri => this.store.select(s => s.test.testRunInfoLogs[tri.containerId]))
      .filter(notNull)
      .map(lines => lines.join(''));

    this.vncReady$ = this.testRunLogs$.map(lines => lines.indexOf('noVNC HTML client started') >= 0);
    this.vncReady$.filter(r => r === true).take(1).subscribe(ready => this.view.vnc = true)

  }

  close() {
    this.activeModal.close();
  }
}
