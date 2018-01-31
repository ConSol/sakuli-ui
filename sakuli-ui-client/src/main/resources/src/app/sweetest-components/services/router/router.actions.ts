import {Action} from '@ngrx/store';
import {NavigationExtras} from '@angular/router';


export const ROUTER_GO = '[Router] Go';
export class RouterGo implements Action {
  readonly type = ROUTER_GO;

  constructor(public payload: {
    path: any[];
    query?: object;
    extras?: NavigationExtras;
  }) {}
}

export const ROUTER_BACK = '[Router] RouterBack';
export class RouterBack implements Action {
  readonly type = ROUTER_BACK;
}

export const ROUTER_FORWARD = '[Router] RouterForward';
export class RouterForward implements Action {
  readonly type = ROUTER_FORWARD;
}

export type RouterActions
  = RouterGo
  | RouterBack
  | RouterForward;
