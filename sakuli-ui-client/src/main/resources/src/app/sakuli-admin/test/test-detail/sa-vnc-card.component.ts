import {ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {log} from "../../../core/redux.util";
import {Observable} from "rxjs/Observable";

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
      <div style="flex-grow: 1">
        <a [href]="webSrc$ | async" target="_blank">
          <sc-icon icon="fa-external-link">
            VNC-Web: {{webPort}}
          </sc-icon>
        </a>
      </div>
      <button class="btn btn-link p-0" (click)="fullScreen()">
        <sc-icon icon="fa-expand"></sc-icon>
      </button>
    </div>
    <div class="card-content">
      <iframe allowfullscreen #iframe [src]="webSrc$ | async" target="_parent">
        No iframe support...
      </iframe>
    </div>
  `,
  styles: [`

    .invisible {
      display: none;
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      transform-origin: 0 0;
    }

    .card-header {
      flex-shrink: 0;
      background-color: white;
    }

    .card-content {
      overflow: auto;
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      width: auto;
      padding-top: 56%;
      min-height: 400px;
      position: relative;
    }

    .btn-fs:hover /deep/ .fa {
      transform: scale(1.2, 1.2) !important;
    }
  `]
})
export class SaVncCard implements OnInit {

  @Input() vncPort: number;
  @Input() webPort: number;
  @Input() gateway: string;

  @ViewChild('iframe') iframe: ElementRef;

  interactiveMode$ = new BehaviorSubject<boolean>(false);
  webSrc$: Observable<SafeResourceUrl>;
  interactiveToggleText$: Observable<string>;
  lockIcon$: Observable<string>;

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
    this.webSrc$ = this.interactiveMode$
      .distinctUntilChanged()
      .skipWhile(() => this.gateway == null)
      .map(isI => isI ? '' : '1')
      .map(viewOnly => this.sanitizer.bypassSecurityTrustResourceUrl(
        `api/novnc/${this.gateway}/${this.webPort}?path=ws/novnc/${this.gateway}/${this.webPort}&password=sakuli&view_only=${viewOnly}`
      ))
      .do(log('New no vnc ulr'));

    this.interactiveToggleText$ = this.interactiveMode$.map(i => i
      ? 'Turn interaction off'
      : 'Turn interaction on'
    );
    this.lockIcon$ = this.interactiveMode$.map(isI => isI ? 'fa-unlock-alt' : 'fa-lock');
  }


  toggleInteractiveMode(isInteractive: boolean) {
    this.interactiveMode$.next(isInteractive);

  }

}
