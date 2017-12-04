import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {TokenService} from "./token.service";

@Injectable()
export class ScAuthenticationService {

  constructor(
    readonly http: Http,
    readonly token: TokenService
  ) {}

  login(username: string, password: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/login', JSON.stringify({username, password}),{headers})
      .map(r => {
        const token = r.text();
        if(token) {
          this.token.setToken(token);
        } else {
          throw new Error("Wrong credentials");
        }
        return token;
      })
  }
}
