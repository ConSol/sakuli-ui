import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {authSelectors, NavigateToLogin} from "../sweetest-components/services/access/auth/auth.state";
import {AppInfoService} from "../sweetest-components/services/access/app-info.service";
import {log, notNull} from "../core/redux.util";
import {RouterStateSnapshot} from "@angular/router/src/router_state";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SakuliAuthGuardService implements CanActivate {

  constructor(
    private store: Store<AppState>,
    private info: AppInfoService
    ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
      .select(authSelectors.isLoggedIn())
      .combineLatest(this
        .info
        .getAppInfo()
        .filter(notNull)
        .map(i => i.authenticationEnabled)
      )
      .do(log('bool table'))
      .map(([loggedIn, authenticationEnabled]) => !(!loggedIn && authenticationEnabled))
      .do(canNavigate => {
        console.log('cannav', canNavigate);
        if(!canNavigate) {
          console.log('go to login');
          this.store.dispatch(new NavigateToLogin())
        }
      });
  }
}
