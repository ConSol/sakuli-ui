import {
  Component, ElementRef, HostListener, Input, OnInit, Renderer2,
  ViewChild
} from "@angular/core";

@Component({
  selector: 'sc-logs',
  template: `    
    <pre #pre><ng-content></ng-content></pre>
  `,
  styles: [`
    :host() {
      overflow: auto;
      background: rgb(30, 30, 30);
      position: relative;
    }
    
    pre {
      color: rgb(200, 200, 200);
      overflow: visible;
      margin: 1rem;
    }

  `]
})
export class ScLogComponent implements OnInit {
  @ViewChild('pre') pre: ElementRef;

  @Input() follow: boolean;


  private latestScrollPosition = 0;
  @HostListener('scroll', ['$event'])
  onHostScroll($event: any) {
    if(this.latestScrollPosition > this.scrollTop) {
      this.follow = false;
    }
    if(this.scrollTop >= this.scrollHeight - (10 + this.height)) {
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
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    const mo = new MutationObserver(m => this.followScroll());
    mo.observe(this.pre.nativeElement, {
      characterData: true,
      subtree: true,
    })
  }

  followScroll() {
    if(this.follow) {
      this.scrollY(this.scrollHeight);
    }
  }
}
