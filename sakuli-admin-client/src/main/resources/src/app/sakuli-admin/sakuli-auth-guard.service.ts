import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {authSelectors, NavigateToLogin} from "../sweetest-components/services/access/auth/auth.state";

@Injectable()
export class SakuliAuthGuardService implements CanActivate {

  constructor(private store: Store<AppState>,) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.store
      .select(authSelectors.isLoggedIn())
      .do(loggedIn => {
        if(!loggedIn) {
          this.store.dispatch(new NavigateToLogin())
        }
      });
  }
}
