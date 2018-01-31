import {Component, HostListener} from '@angular/core';
import {Store} from "@ngrx/store";
import {Logout} from "./auth.state";

@Component({
  selector: 'sc-logout',
  template: `
    <ng-content></ng-content>  
  `
})

export class ScLogoutComponent {

  @HostListener('click', ['$event'])
  clickHostListener($event: MouseEvent) {
    this.store.dispatch(new Logout());
  }

  constructor(
    readonly store: Store<any>,
  ) {
  }

}
