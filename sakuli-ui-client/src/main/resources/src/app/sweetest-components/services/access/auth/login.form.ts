import {FormControl, FormGroup} from "@angular/forms";

export class LoginForm extends FormGroup {

  constructor() {
    super({
      user: new FormControl(),
      password: new FormControl()
    })
  }

  set user(name: string) {
    this.get('user').setValue(name);
  }

  set password(pw: string) {
    this.get('password').setValue(pw);
  }

  get user() {
    return this.get('user').value;
  }

  get password() {
    return this.get('password').value;
  }
}
