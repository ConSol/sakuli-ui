import {ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {DomSanitizer} from "@angular/platform-browser";
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
      <div style="flex-grow: 1">
        <a [href]="vncSrc" target="_blank" class="mr-1">
          <sc-icon icon="fa-external-link">
            VNC-Port: {{vncPort}}
          </sc-icon>
        </a>
        <a [href]="webSrc" target="_blank">
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
      <iframe allowfullscreen #iframe [src]="webSrc">
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
export class SaVncCard implements OnInit {

  @Input() vncPort: number;
  @Input() webPort: number;

  @ViewChild('iframe') iframe: ElementRef;

  interactiveMode$ = new BehaviorSubject<boolean>(false);
  private viewOnly: 'true' | 'false';

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
    this.interactiveMode$.subscribe(im => this.viewOnly = im ? 'false' : 'true');
  }

  get interactiveToggleText$() {
    return this.interactiveMode$.map(i => i
      ? 'Turn interaction off'
      : 'Turn interaction on'
    )
  }

  toggleInteractiveMode(isInteractive: boolean) {
    this.interactiveMode$.next(isInteractive);

  }

  get lockIcon$() {
    return this.interactiveMode$.map(isI => isI ? 'fa-unlock-alt' : 'fa-lock')
  }

  get webSrc() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `api/novnc/${this.webPort}?path=ws/novnc/${this.webPort}&password=sakuli&view_only=${this.viewOnly}`
    )
  }

  get vncSrc() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `vnc://sakuli@localhost:${this.vncPort}`
    )
  }

}
