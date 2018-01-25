import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {Observable} from "rxjs/Observable";
import {OpenWorkspaceDialog} from "./workspace/state/project.actions";
import {workpaceSelectors} from "./workspace/state/project.interface";
import {log} from "../core/redux.util";
import {RouterStateSnapshot} from "@angular/router/src/router_state";

@Injectable()
export class SakuliProjectGuardService implements CanActivate {

  constructor(
    private store: Store<AppState>,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('Project guard')
    return this.store.select(workpaceSelectors.workspace)
      .map((workspace) => {
        if (workspace) {
          return true
        } else {
          this.store.dispatch(new OpenWorkspaceDialog());
          return false;
        }
      })
      .do(log('pg'));
  }
}
