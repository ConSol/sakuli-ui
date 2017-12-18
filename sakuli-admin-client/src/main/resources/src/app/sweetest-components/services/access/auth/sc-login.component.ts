import {Component, EventEmitter, OnInit, Optional, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {LoginForm} from "./login.form";
import {ScAuthenticationService} from "../sc-authentication.service";
import {ScToastService} from "../../../components/presentation/toast/toast.service";
import {DangerToast, SuccessToast} from "../../../components/presentation/toast/toast.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalAware} from "../../../components/presentation/modal/sc-modal.service";

@Component({
  moduleId: module.id,
  selector: 'sc-login-component',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Login to Sakuli-UI</h4>
    </div>
    <div class="modal-body">
      <form [formGroup]="loginForm" (submit)="doLogin()">
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

export class ScLoginComponent implements ModalAware{
  getActiveModal(): NgbActiveModal {
    return this.modal;
  }

  readonly loginForm = new LoginForm();

  @Output() success = new EventEmitter();

  constructor(readonly authService: ScAuthenticationService,
              readonly toastService: ScToastService,
              @Optional() readonly modal: NgbActiveModal) {
  }

  doLogin() {
    const user = this.loginForm.user;
    const password = this.loginForm.password;
    this.authService.login(user, password)
      .subscribe(
        t => {
          this.toastService.create(new SuccessToast('Successfully logged in'));
          this.close();
        },
        e => this.toastService.create(new DangerToast('Failed to login', e))
      );
  }

  close() {
    if(this.modal) {
      this.modal.close();
    }
    this.success.next();
  }


}
