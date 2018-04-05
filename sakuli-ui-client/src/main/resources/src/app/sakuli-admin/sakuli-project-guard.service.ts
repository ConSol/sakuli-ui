import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {Observable} from "rxjs/Observable";
import {OpenWorkspaceDialog} from "./workspace/state/project.actions";
import {workspaceSelectors} from "./workspace/state/project.interface";
import {RouterStateSnapshot} from "@angular/router/src/router_state";

@Injectable()
export class SakuliProjectGuardService implements CanActivate {

  constructor(
    private store: Store<AppState>,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(workspaceSelectors.workspace)
      .map((workspace) => {
        if (workspace) {
          return true
        } else {
          this.store.dispatch(new OpenWorkspaceDialog());
          return false;
        }
      })
  }
}
