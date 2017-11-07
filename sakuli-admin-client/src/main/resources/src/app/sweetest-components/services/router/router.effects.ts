import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import {ROUTER_BACK, ROUTER_FORWARD, ROUTER_GO, RouterGo} from "./router.actions";

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigate$ = this.actions$.ofType(ROUTER_GO)
    .map((action: RouterGo) => action.payload)
    .do(({ path, query: queryParams, extras}) => this.router.navigate(path, { queryParams, ...extras }));

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.ofType(ROUTER_BACK)
    .do(() => this.location.back());

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.ofType(ROUTER_FORWARD)
    .do(() => this.location.forward());

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}
}
