import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {SakuliProjectGuardService} from "./sakuli-project-guard.service";
import {SakuliAuthGuardService} from "./sakuli-auth-guard.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SakuliAuthProjectGuardService implements CanActivate {

  constructor(
    readonly projectGuard:SakuliProjectGuardService,
    readonly authGuard: SakuliAuthGuardService
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authGuard
      .canActivate(route, state)
      .mergeMap(c => {
        return c ? this.projectGuard.canActivate(route, state) : Observable.of(false);
      })
  }

}
