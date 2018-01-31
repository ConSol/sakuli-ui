import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginForm} from "./login.form";
import {ScAuthenticationService} from "./sc-authentication.service";
import {Store} from "@ngrx/store";
import {AppInfoService} from "../app-info.service";
import {NavigateToDashboard} from "../../../../sakuli-admin/dashboard/dashboard.state";

@Component({
  moduleId: module.id,
  selector: 'sc-login-component',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Login to Sakuli-UI</h4>
    </div>
    <div class="modal-body">
      <form [formGroup]="loginForm" (submit)="doLogin()" (keyup)="$event.keyCode === 13 ? doLogin(): null">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" formControlName="user" class="form-control" id="username" aria-describedby="emailHelp"
                 placeholder="Enter username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" formControlName="password" class="form-control" id="password" placeholder="Password">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="submit" class="btn btn-primary" (click)="doLogin()">Login</button>
    </div>
  `
})

export class ScLoginComponent  implements OnInit {

  readonly loginForm = new LoginForm();

  @Output() success = new EventEmitter();

  constructor(
    readonly authService: ScAuthenticationService,
    readonly store: Store<any>,
    readonly info: AppInfoService
  ) {  }

  // TODO: Refactor to auth guard
  ngOnInit() {
    this.info.getAppInfo()
      .filter(i => !i.authenticationEnabled)
      .subscribe(i => {
        console.log('Disptach Dashboar nav');
        this.store.dispatch(new NavigateToDashboard())
      })
  }

  doLogin() {
    const user = this.loginForm.user;
    const password = this.loginForm.password;
    this.authService.login(user, password)
  }

}
