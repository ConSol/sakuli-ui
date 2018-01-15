import {
  ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {Observable} from "rxjs/Observable";
import {notNull} from "../../../core/redux.util";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SakuliTestSuite} from "../../../sweetest-components/services/access/model/sakuli-test-model";
import {TestExecutionEntity, testExecutionSelectors} from "../state/testexecution.state";
import {testSuiteSelectId} from "../state/testsuite.state";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-vnc-card',
  template: `
    <div class="card-header d-flex justify-content-between align-items-center">
      <label
        class="form-check-label cursor-pointer pl-0"
        [ngbTooltip]="interactiveToggleText$ | async"
        container="body"
      >
        <input type="checkbox"
               (change)="toggleInteractiveMode(interactiveToggle.checked)"
               #interactiveToggle
               class="invisible interactiveToggle">
        <sc-icon [icon]="lockIcon$ | async"
                 class="btn btn-success mr-3"
                 [ngClass]="{
                    'btn-success': (interactiveMode$ | async),
                    'btn-danger': !(interactiveMode$ | async)
                  }">
        </sc-icon>
      </label>
      <div style="flex-grow: 1" *ngIf="testRunInfo$ | async; let testRunInfo">
        <a [href]="vncExtern$ | async" target="_blank" class="mr-1">
          <sc-icon icon="fa-external-link">
            VNC-Port: {{testRunInfo?.vncPort}}
          </sc-icon>
        </a>
        <a [href]="vncSrc$ | async" target="_blank">
          <sc-icon icon="fa-external-link">
            VNC-Web: {{testRunInfo?.vncWebPort}}
          </sc-icon>
        </a>
      </div>
      <button class="btn btn-link p-0" (click)="fullScreen()">
        <sc-icon icon="fa-expand"></sc-icon>
      </button>
    </div>
    <div class="card-content">
      <iframe allowfullscreen #iframe [src]="vncSrc$ | async">
        No iframe support...
      </iframe>
    </div>
  `,
  styles: [`

    .invisible {
      display: none;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      overflow: auto;
      transform-origin: 0 0;
    }

    .card-header {
      flex-shrink: 0;
      background-color: white;
    }

    .col {
      padding: 0;
      margin: 0;
      transition: all .35s ease-out;
    }

    .card-content {
      overflow: auto;
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      width: auto;
      height: 400px;
    }

    .btn-fs:hover /deep/ .fa {
      transform: scale(1.2, 1.2) !important;
    }
  `]
})
export class SaVncCard implements OnInit, OnChanges {

  @Input() testSuite: SakuliTestSuite;

  @ViewChild('iframe') iframe: ElementRef;

  testRunInfo$: Observable<TestExecutionEntity>;

  vncReady$: Observable<boolean>;

  vncExtern$: Observable<SafeResourceUrl>;

  //TODO get current host instead of localhost
  vncSrc$: Observable<SafeResourceUrl>;

  interactiveMode$ = new BehaviorSubject<boolean>(false);

  fullScreen() {
    const elementRef = this.iframe;
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

  get interactiveToggleText$() {
    return this.interactiveMode$.map(i => i
      ? 'Turn interaction off'
      : 'Turn interaction on'
    )
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
    console.log('test', isInteractive);
    this.interactiveMode$.next(isInteractive);
  }

  get lockIcon$() {
    return this.interactiveMode$.map(isI => isI ? 'fa-unlock-alt' : 'fa-lock')
  }

  initObservablesWithTestSuite(testSuite: SakuliTestSuite) {
    this.vncReady$ = this.store
      .select(testExecutionSelectors.latestByTestSuite(testSuite))
      .map(te => te.vncReady);

    this.testRunInfo$ = this.store.select(testExecutionSelectors.latestByTestSuite(this.testSuite)).filter(notNull).first();

    this.vncSrc$ = this.testRunInfo$
      .combineLatest(this.interactiveMode$.map(t => t ? 'false' : 'true'))
      .map(([tri, viewOnly]) => `http://localhost:${tri.vncWebPort}/vnc_auto.html?password=sakuli&view_only=${viewOnly}`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));

    this.vncExtern$ = this.testRunInfo$
      .map(tri => `vnc://sakuli@localhost:${tri.vncPort}`)
      .map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

}
