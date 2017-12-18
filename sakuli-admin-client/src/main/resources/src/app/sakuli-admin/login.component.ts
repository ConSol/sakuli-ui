import {Component, OnInit, ViewChild} from '@angular/core';
import {ScModalService} from "../sweetest-components/components/presentation/modal/sc-modal.service";
import {ScLoginComponent} from "../sweetest-components/services/access/auth/sc-login.component";
import {Store} from "@ngrx/store";
import {RouterGo} from "../sweetest-components/services/router/router.actions";

@Component({
  selector: 'login-component',
  template: `
  <sc-login-component
    #loginWindow 
  >
  </sc-login-component>`
})

export class LoginComponent implements OnInit {

  @ViewChild(ScLoginComponent) loginWindow: ScLoginComponent;

  constructor(
    readonly store: Store<any>,
    readonly modal: ScModalService
  ) {

  }

  ngOnInit() {
    this.modal.closeAll();
    this.loginWindow.success.subscribe(() => {
      this.store.dispatch(new RouterGo({path: ['/dashboard']}))
    })
  }
}
