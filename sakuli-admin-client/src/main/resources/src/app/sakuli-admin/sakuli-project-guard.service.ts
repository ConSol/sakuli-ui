import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {Observable} from "rxjs/Observable";
import {OpenWorkspaceDialog} from "./workspace/state/project.actions";
import {authSelectors} from "../sweetest-components/services/access/auth/auth.state";
import {workpaceSelectors} from "./workspace/state/project.interface";

@Injectable()
export class SakuliProjectGuardService implements CanActivate {

  constructor(
              private store: Store<AppState>,
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.store.select(workpaceSelectors.workspace)
      .combineLatest(this.store.select(authSelectors.isLoggedIn()))
      .mergeMap(([workspace, loggedIn]) => {
        if (loggedIn && workspace) {
          return Observable.of(true);
        } else if(loggedIn) {
          this.store.dispatch(new OpenWorkspaceDialog());
        }
        return Observable.of(false);
      });
  }
}
