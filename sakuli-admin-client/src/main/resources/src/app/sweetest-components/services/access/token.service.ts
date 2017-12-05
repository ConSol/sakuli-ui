import {Injectable} from "@angular/core";

@Injectable()
export class TokenService {

  private storage: Storage = sessionStorage;

  private token: string = '';
  private prefix = 'Bearer ';

  constructor() {
    this.token = this.storage.getItem('AUTH_TOKEN');
  }

  hasToken() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getPrefixedToken() {
    return `${this.prefix}${this.token}`;
  }

  setToken(token: string) {
    this.token = token;
  }

  persistToken() {
    if(this.token) {
      this.storage.setItem("AUTH_TOKEN", this.token);
    }
  }

  forgetToken() {
    this.token = '';
  }
}
