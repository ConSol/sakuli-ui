import {Component, ElementRef, HostBinding, ViewChild} from "@angular/core";
import {TestRunInfo} from "../../../sweetest-components/services/access/model/test-run-info.interface";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {Observable} from "rxjs/Observable";
import {log, notNull} from "../../../core/redux.util";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {logsForCurrentRunInfo} from "../state/test.interface";

@Component({
  selector: 'sa-log-card', // TODO: refactor filenames
  template: `
    <div class="card-header d-flex justify-content-between">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <button class=" btn-link nav-link"
                  (click)="view = 'log'"
                  [ngClass]="{'active': view === 'log'}"
          >Logs
          </button>
        </li>
        <li class="nav-item" *ngIf="vncReady$ | async">
          <button class="btn-link nav-link"
                  (click)="view = 'vnc'"
                  [ngClass]="{'active': view === 'vnc'}"
          >VNC
          </button>
        </li>
      </ul>
      <button class="btn btn-link" (click)="fullScreen()">
        <sc-icon icon="fa-expand"></sc-icon>
      </button>
    </div>
      <sc-logs #logs class="card-block logs col" *ngIf="view === 'log'" [follow]="true" [messages]="testRunLogs$ | async">
      </sc-logs>
      <div #iframe class="card-block vnc col" *ngIf="view === 'vnc'">
        <iframe allowfullscreen #iframe [src]="vncSrc$ | async">
          No iframe support...
        </iframe>
      </div>
  `,
  styles: [`
    .card-header {
      padding-bottom: 0;
      padding-top: 0;
      background-color: white;
    }
    
    .vnc iframe {
      width: 100%;
      height: 100%;
      border: 0;
      overflow: auto;
      transform-origin: 0 0;
    }

    .col {
      padding: 0;
      margin: 0;
      transition: all .35s ease-out;
    }

    .card-block {
      overflow: auto;
      padding: 0;
      display: flex;
      flex-direction: row;
    }

    .btn-fs:hover /deep/ .fa {
      transform: scale(1.2, 1.2) !important;
    }
    
    .nav-link {
      border-radius: 0;
      border-top: 0;
    }
    
    .nav-link:focus {
      outline: none;
    }
  `]
})
export class LogModalComponent {

  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild('logs') logs: ElementRef;

  testRunInfo$: Observable<TestRunInfo>;
  vncSrc$: Observable<SafeResourceUrl>;
  vncExtern$: Observable<SafeResourceUrl>;
  vncReady$: Observable<boolean>;

  view: "vnc" | "log" = "log";

  fullScreen() {
    const elementRef = this.view === 'log' ? this.logs : this.iframe;
    const e = elementRef.nativeElement;
    if (e.requestFullscreen) {
      e.requestFullscreen();
    } else if (e.mozRequestFullscreen) {
      e.mozRequestFullscreen();
    } else if (e.webkitRequestFullscreen) {
      e.webkitRequestFullscreen();
    }
  }

  @HostBinding('class')
  get hostClass() {
    return 'card';
  }

  constructor(private store: Store<AppState>,
              private sanitizer: DomSanitizer) {

    this.testRunInfo$ = this.store.select(s => s.test.testRunInfo).filter(notNull).first();
    this.vncSrc$ = this.testRunInfo$
      .map(tri => `http://localhost:${tri.vncWebPort}?password=sakuli`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));

    this.vncExtern$ = this.testRunInfo$
      .map(tri => `vnc://sakuli@localhost:${tri.vncPort}`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));

    this.vncReady$ = this
      .testRunLogs$
      .map(lines => !!lines.find(l => l.includes('noVNC HTML client started')))
    //.takeWhile(hasVnc => !hasVnc)
    ;
    this.vncReady$.filter(r => r === true).take(1).subscribe(ready => this.view = 'vnc')
}


  get testRunLogs$(): Observable<string[]> {
    return this.store.select(logsForCurrentRunInfo);
  }

}
