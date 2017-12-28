import {
  ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {Observable} from "rxjs/Observable";
import {log, notNull} from "../../../core/redux.util";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {testExecutionLogSelectors} from "../state/test-execution-log.state";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestExecutionEntity, testExecutionSelectors} from "../state/testexecution.state";
import {testSuiteSelectId} from "../state/testsuite.state";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    <sc-logs #logs class="card-block p-0 logs col" *ngIf="view === 'log'" [follow]="true" [messages]="testRunLogs$ | async">
    </sc-logs>
    <div #iframe class="card-block vnc col p-0" *ngIf="view === 'vnc'">
      <iframe allowfullscreen #iframe [src]="vncSrc$ | async">
        No iframe support...
      </iframe>
    </div>
    <div class="p-3 card-block">
      <label class="form-check-label">
        <input type="checkbox" (change)="toggleInteractiveMode(interactiveToggle.checked)" #interactiveToggle  class="interactiveToggle">
        Interactive mode
      </label>
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
export class LogModalComponent implements OnInit, OnChanges {

  @Input() testSuite: SakuliTestSuite;

  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild('logs') logs: ElementRef;

  testRunInfo$: Observable<TestExecutionEntity>;

  testRunLogs$: Observable<string[]>;

  vncReady$: Observable<boolean>;

  view: "vnc" | "log" = "log";
  vncExtern$: Observable<SafeResourceUrl>;

  //TODO get current host instead of localhost
  vncSrc$: Observable<SafeResourceUrl>;

  interactiveMode$ = new BehaviorSubject<boolean>(false);

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
  }

  ngOnInit() {
    this.initObservablesWithTestSuite(this.testSuite);
  }

  ngOnChanges(change: SimpleChanges) {
    const tsChanges = change.testSuite;
    if (tsChanges) {
      const curr = tsChanges.currentValue;
      const prev = tsChanges.previousValue;
      if ((!prev && curr) || testSuiteSelectId(curr) !== testSuiteSelectId(prev)) {
        this.initObservablesWithTestSuite(curr);
      }
    }
  }

  toggleInteractiveMode(isInteractive: boolean) {
    this.interactiveMode$.next(isInteractive);
  }

  initObservablesWithTestSuite(testSuite: SakuliTestSuite) {
    this.testRunLogs$ = this.store
      .select(testExecutionLogSelectors.latestForTestSuite(testSuite))
      .debounceTime(150)
      .map(logs => logs.map(log => log.message));

    this.vncReady$ = this
      .testRunLogs$
      .map(lines => !!lines.find(l => l.includes('noVNC HTML client started')));

    this.vncReady$.filter(r => r === true).take(1).subscribe(ready => this.view = 'vnc');

    this.testRunInfo$ = this.store.select(testExecutionSelectors.latestByTestSuite(this.testSuite)).filter(notNull).first();

    this.vncSrc$ = this.testRunInfo$
      .combineLatest(this.interactiveMode$.map(t => t ? 'false': 'true'))
      .map(([tri, viewOnly]) => `http://localhost:${tri.vncWebPort}?password=sakuli&view_only=${viewOnly}`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));

    this.vncExtern$ =  this.testRunInfo$
      .map(tri => `vnc://sakuli@localhost:${tri.vncPort}`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

}
