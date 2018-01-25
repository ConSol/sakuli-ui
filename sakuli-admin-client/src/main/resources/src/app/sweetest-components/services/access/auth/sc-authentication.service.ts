import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {CreateToast} from "../../../components/presentation/toast/toast.actions";
import {DangerToast} from "../../../components/presentation/toast/toast.model";
import {
  Login, LOGIN, LOGIN_SUCCESS, LoginSuccess, Logout, LOGOUT, LOGOUT_SUCCESS, LogoutSuccess,
  NavigateToLogin
} from "./auth.state";
import {RouterGo} from "../../router/router.actions";

@Injectable()
export class ScAuthenticationService {

  constructor(readonly http: HttpClient,
              readonly store: Store<any>,
              readonly actions$: Actions
  ) {}

  @Effect() login$ = this.actions$
    .ofType(LOGIN)
    .mergeMap((l: Login) => {
      const {username, password} = l;
      return this.http.post('/login',
        JSON.stringify({username, password}),
        {responseType: 'text'}
      ).map(token => {
        if(token) {
          return new LoginSuccess({name: username}, token)
        } else {
          return new CreateToast(new DangerToast("Wrong credentials, login failed", null))
        }
      })
    });

  /**
   * using an effect is not necessary at all, but might be handy in the
   * future if we need to handle the logout in an async manner
   * @type {Observable<LogoutSuccess>}
   */
  @Effect() logout$ = this.actions$
    .ofType(LOGOUT)
    .mapTo(new LogoutSuccess())
  ;

  @Effect() logoutSuccess$ = this.actions$
    .ofType(LOGOUT_SUCCESS)
    .mapTo(new NavigateToLogin());

  @Effect() loginSuccess$ = this.actions$
    .ofType(LOGIN_SUCCESS)
    .mapTo(new RouterGo({path: ['/']}));

  login(username: string, password: string) {
    this.store.dispatch(new Login(username, password));
  }

  logout() {
    this.store.dispatch(new Logout())
  }
}
