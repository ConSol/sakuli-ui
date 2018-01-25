import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {RouterGo} from "../../router/router.actions";

export const AuthFeatureName = 'auth';

export interface IUser {
  name: string;
}

export interface AuthState {
  user: IUser,
  token: string
}

export const AuthStateInit: AuthState = {
  user: null,
  token: null
};

export const LOGOUT = '[AUTH] Logout';
export class Logout implements Action {
  readonly type = LOGOUT;
  constructor() {}
}

export const LOGOUT_SUCCESS = '[AUTH] Logout success';
export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
  constructor() {}
}

export const LOGIN = '[AUTH] LOGIN';
export class Login implements Action {
  readonly type = LOGIN;
  constructor(
    readonly username: string,
    readonly password: string
  ) {}
}

export const LOGIN_SUCCESS = '[AUTH] LOGIN SUCCESS';
export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(
    readonly user: IUser,
    readonly token: string) {}
}


export class NavigateToLogin extends RouterGo {
  constructor() {
    super({path: ['/login']})
  }
}

const state = createFeatureSelector<AuthState>(AuthFeatureName);

function token() {
  return createSelector(state, s => s ? s.token : null)
}

function isLoggedIn() {
  return createSelector(token(), t =>  {
    return !!t
  })
}

export const authSelectors = {
  state,
  token,
  isLoggedIn
};

export type AuthActions = Login | Logout | LoginSuccess | LogoutSuccess;

export function authReducer(state: AuthState = AuthStateInit, action: AuthActions) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return ({...state, ...action})
    }
    case LOGOUT_SUCCESS: {
      return AuthStateInit
    }
  }
  return state || AuthStateInit;
}
