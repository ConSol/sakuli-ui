import {
  AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, NgZone,
  ViewChild
} from "@angular/core";
import {LogMessage} from "../../../../sakuli-admin/test/state/test.interface";
import {AnsiColorPipe} from "./ansi-color.pipe";
import {Observable} from "rxjs/Observable";


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-logs',
  template: `
    <div class="pre" #pre>
      <div class="line"
           *ngFor="let message of messages; let i = index"
           [innerHTML]="message | ansiColors | safeHtml"
      >
      </div>
    </div>
  `,
  styles: [`
    :host {
      background: rgb(30, 30, 30);
      display: flex;
    }

    pre, .pre {
      color: rgb(200, 200, 200);
      margin: 1rem;
      font-family: medium Consolas, "Andale Mono", Monaco, "Liberation Mono", "Bitstream Vera Sans Mono", "DejaVu Sans Mono", monospace;
    }

    .line:before {
      color: yellow;
    }
    
    .line {
      background: rgb(30, 30, 30);
      white-space: pre;
    }
  `,
  AnsiColorPipe.Styles
  ]
})
export class ScLogComponent implements AfterViewInit, AfterViewChecked {

  @ViewChild('pre') pre: ElementRef;

  @Input() follow: boolean;

  @Input() messages: LogMessage[];

  private latestScrollPosition = 0;

  onHostScroll() {
    if (this.latestScrollPosition > this.scrollTop) {
      this.follow = false;
    }
    if (this.scrollTop >= this.scrollHeight - (10 + this.height)) {
      this.follow = true;
    }
    this.latestScrollPosition = this.scrollTop;
  }

  get scrollTop() {
    return this.nativeElement.scrollTop;
  }

  get scrollHeight() {
    return this.nativeElement.scrollHeight;
  }

  get height() {
    return this.nativeElement.getClientRects().item(0).height;
  }

  scrollY(y: number) {
    this.nativeElement.scrollTop = y;
  }

  get nativeElement(): HTMLPreElement {
    return this.elRef.nativeElement;
  }

  constructor(
    readonly elRef: ElementRef,
    readonly zone: NgZone
  ) {
  }

  ngAfterViewInit() {
    console.log('....');
    this.zone.runOutsideAngular(() => {
      Observable.fromEvent(this.elRef.nativeElement, 'scroll')
        .debounceTime(50)
        .subscribe(_ => this.onHostScroll())
    })
  }

  ngAfterViewChecked() {
    this.followScroll();
  }

  followScroll() {
    if (this.follow) {
      this.scrollY(this.scrollHeight);
    }
  }
}
