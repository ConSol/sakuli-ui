import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Component({
  selector: 'thumbnail-component',
  template: `
    <ng-template #overlayTemplate>
      <div class="preview">
        <ul class="nav justify-content-end">
          <li class="nav-item" *ngIf="zoomLevel != 1"
          ><a class="nav-link" (click)="zoomLevel = 1">
            <sc-icon icon="fa-undo"></sc-icon>
          </a></li>
          <li class="nav-item"><a class="nav-link" (click)="zoom(-0.1)">
            <sc-icon icon="fa-search-minus"></sc-icon>
          </a></li>
          <li class="nav-item"><a class="nav-link" (click)="zoom(+0.1)">
            <sc-icon icon="fa-search-plus"></sc-icon>
          </a></li>
          <li class="nav-item">
            <a class="nav-link" (click)="closeOverlay()">
              <sc-icon icon="fa-close"></sc-icon>
            </a>
          </li>
        </ul>
        <div class="image-container" #imageContainer>
          <img
            #previewImage
            scAuthenticated
            (click)="hostClick($event, overlayTemplate)"
            [src]="src"
            (dragstart)="$event.preventDefault()"
            (mousedown)="startMoving($event)"
            (mousemove)="scrollMove($event)"
            (mouseup)="stopMoving()"
            [ngStyle]="{transform: 'scale(' + zoomLevel + ')'}"
          />
        </div>
      </div>
    </ng-template>
    <img
      scAuthenticated
      (click)="hostClick($event, overlayTemplate)"
      [src]="src"
      [ngStyle]="ngStyle"
    />
  `,
  styles: [`
    .preview {
      position: relative;
      height: 100vh;
      width: 100vw;
    }

    .preview ul {
      position: absolute;
      z-index: 9999;
    }

    .preview img {
      cursor: move;
    }

    .image-container {
      overflow: auto;
      height: 100vh;
      width: 100vw;
      text-align: center;
    }

    .nav {
      background: rgba(0, 0, 0, 0.55);
      width: 100vw;
    }

    .nav, .nav sc-icon {
      color: silver;
    }
  `]
})

export class ThumbnailComponent implements OnInit {

  @Input() src;
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';
  @Input() style: any;
  private overlayRef: OverlayRef;
  moving: boolean = false;
  startPos: ({ x: number, y: number }) = {x: 0, y: 0};

  @ViewChild('imageContainer') imageContainer: ElementRef;
  @ViewChild('previewImage') previewImage: ElementRef;
  zoomLevel: number = 1;


  hostClick($event: MouseEvent, template: TemplateRef<{}>) {
    if (!this.overlayRef.hasAttached()) {
      const imagePortal = new TemplatePortal(template, this.vcr);
      this.overlayRef.attach(imagePortal);
      this.scrollCenter();
    }
  }

  constructor(readonly overlay: Overlay,
              readonly vcr: ViewContainerRef) {
  }

  get ngStyle() {
    return ({width: this.width, height: this.height, ...this.style})
  }

  closeOverlay() {
    this.overlayRef.dispose();
    this.ngOnInit();
  }

  zoom(_zoom: number) {
    if (this.zoomLevel + _zoom > 0) {
      this.zoomLevel += _zoom;
    }
  }

  ngOnInit() {
    this.overlayRef = this.overlay.create(new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    }));

    this.overlayRef.keydownEvents()
      .filter(e => e.keyCode === 27)
      .subscribe(e => this.closeOverlay());

  }

  startMoving($event: MouseEvent) {
    this.moving = true;
    this.startPos = {
      x: $event.clientX,
      y: $event.clientY
    }
  }

  scrollMove($event: MouseEvent) {
    if (this.moving) {
      const el = (this.imageContainer.nativeElement as HTMLDivElement);
      el.scrollTop += (this.startPos.y - $event.clientY) * .1;
      el.scrollLeft += (this.startPos.x - $event.clientX) * .1;
    }
  }

  scrollCenter() {
    const container = (this.imageContainer.nativeElement as HTMLDivElement);
    const image = (this.imageContainer.nativeElement as HTMLDivElement);
    const wOffset = container.clientWidth - image.clientWidth;
    const hOffset = container.clientHeight - image.clientHeight;

    if(wOffset < 0) {
      container.scrollLeft = Math.abs(wOffset / 2)
    }
    if(hOffset < 0) {
      container.scrollTop = Math.abs(wOffset / 2)
    }
  }

  stopMoving() {
    this.moving = false;
  }

}
