import {Directive, ElementRef, Input} from '@angular/core';
import {Store} from "@ngrx/store";
import {authSelectors} from "./auth.state";
import {HttpClient} from "@angular/common/http";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";

const isImgTag = (e: Element): e is HTMLImageElement => e.tagName.toLowerCase() === 'img';
const isATag = (e: Element): e is HTMLAnchorElement => e.tagName.toLowerCase() === 'a';

@Directive({selector: 'img[scAuthenticated][src], a[scAuthenticated][href]'})
export class ScAuthenticatedImageDirective {

  @Input('src') src;
  @Input('href') href;
  private overlayRef: OverlayRef;

  private native: HTMLImageElement | HTMLAnchorElement;
  constructor(
    readonly el: ElementRef,
    readonly store: Store<any>,
    readonly http:HttpClient,
    readonly overlay: Overlay,
  ) {
    this.native = el.nativeElement;

  }

  ngOnInit() {
    this.fetchAuthenticatedImage();
  }

  get url() {
    return isImgTag(this.native) ? this.src : this.href;
  }

  async toDataUrl(blob: Blob): Promise<string> {
    return new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    })
  }

  private fetchAuthenticatedImage() {
    this.store
      .select(authSelectors.token())
      .first()
      .mergeMap(token => this.http.get<any>(this.url, {
        responseType:'blob' as "json",
        headers: {
          Authentication: `Bearer ${token}`
        }
      }))
      .mergeMap(b => this.toDataUrl(b))
      .subscribe(src => {
        if(isImgTag(this.native)) {
          this.native.src = src;
        }
      })
  }
}
