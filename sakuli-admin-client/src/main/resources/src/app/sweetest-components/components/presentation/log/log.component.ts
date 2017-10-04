import {
  ChangeDetectionStrategy,
  Component, ElementRef, HostListener, Input, OnInit, ViewChild
} from "@angular/core";
import {LogMessage} from "../../../../sakuli-admin/test/state/test.interface";
import {AnsiColorPipe} from "./ansi-color.pipe";



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-logs',
  template: `
    <div class="pre" #pre>
      <div [attr.data-line-number]="formatLineNumber(i, messages.length)" class="line"
           *ngFor="let message of messages; let i = index"
           [innerHTML]="message | ansiColors | safeHtml"
      >
      </div>
    </div>
  `,
  styles: [`
    :host {
      overflow-x: scroll;
      background: rgb(30, 30, 30);
      display: flex;
    }

    pre, .pre {
      color: rgb(200, 200, 200);
      margin: 1rem;
      font-family: medium Consolas, "Andale Mono", Monaco, "Liberation Mono", "Bitstream Vera Sans Mono", "DejaVu Sans Mono", monospace;
    }

    .line:before {
      content: attr(data-line-number);
      color: yellow;
    }
  `,
  AnsiColorPipe.Styles
  ]
})
export class ScLogComponent implements OnInit {
  @ViewChild('pre') pre: ElementRef;

  @Input() follow: boolean;

  @Input() messages: LogMessage[];

  private latestScrollPosition = 0;

  @HostListener('scroll', ['$event'])
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

  formatLineNumber(i: number, max: number) {
    const digits = `${max}`.length;
    const lPad = (str: string, m: number) => str.length < m ? `0${lPad(str, m - 1)}` : str;
    return lPad(`${i}`, digits) + ' ';
  }

  constructor(readonly elRef: ElementRef) {
  }

  ngOnInit(): void {
    const mo = new MutationObserver(m => this.followScroll());
    mo.observe(this.pre.nativeElement, {
      characterData: true,
      subtree: true,
    })
  }



  followScroll() {
    if (this.follow) {
      this.scrollY(this.scrollHeight);
    }
  }
}
