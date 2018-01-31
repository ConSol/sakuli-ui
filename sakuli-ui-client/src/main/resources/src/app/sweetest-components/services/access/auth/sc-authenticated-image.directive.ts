import {Directive, ElementRef, Input} from '@angular/core';
import {Store} from "@ngrx/store";
import {authSelectors} from "./auth.state";
import {HttpClient} from "@angular/common/http";

@Directive({selector: 'img[scAuthenticated]'})
export class ScAuthenticatedImageDirective {

  @Input("src") src;

  private native: HTMLImageElement;
  constructor(
    readonly el: ElementRef,
    readonly store: Store<any>,
    readonly http:HttpClient
  ) {
    this.native = el.nativeElement;

  }

  ngOnInit() {
    this.fetchAuthenticatedImage();
  }


  private fetchAuthenticatedImage() {
    this.store
      .select(authSelectors.token())
      .first()
      .mergeMap(token => this.http.get<any>(this.src, {
        responseType:'blob' as "json",
        headers: {
          Authentication: `Bearer ${token}`
        }
      }))
      .map(b => URL.createObjectURL(b))
      .subscribe(src => this.native.src = src)
  }
}
