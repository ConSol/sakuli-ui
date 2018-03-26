import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Directive({selector: '[scroll-down]'})
export class ScrollDownDirective implements OnInit {

  private latestScrollPosition = 0;
  private follow = new BehaviorSubject(true);

  @Input('scroll-down') scrollDown: Observable<any>;


  @HostListener('scroll', ['$event'])
  onHostScroll() {
    if (this.latestScrollPosition > this.scrollTop) {
      this.follow.next(false);
    }
    if (this.scrollTop >= this.scrollHeight - (10 + this.height)) {
      this.follow.next(true);
    }
    this.latestScrollPosition = this.scrollTop;
  }

  get scrollTop() {
    return this.el.nativeElement.scrollTop;
  }

  get scrollHeight() {
    return this.el.nativeElement.scrollHeight;
  }

  get scroll() {
    return this.el.nativeElement.scrollHeight;
  }

  get height() {
    return this.el.nativeElement.getClientRects().item(0).height;
  }

  private mutationSubject: Subject<any> = new Subject();

  constructor(readonly el: ElementRef) {}

  ngOnInit(): void {
    let scrollObserver: Observable<any>;
    if (!this.scrollDown) {
      const next = (mutation: MutationRecord) => this.mutationSubject.next(mutation);
      const mutationObserver = new MutationObserver(mutations => mutations.forEach(next));
      mutationObserver.observe(this.el.nativeElement, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
      scrollObserver = this.mutationSubject;
    } else {
      scrollObserver = this.scrollDown
    }
    scrollObserver
      .combineLatest(this.follow)
      .filter(([_, follow]) => follow)
      .subscribe(_ => {
        this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
      })
  }


}
