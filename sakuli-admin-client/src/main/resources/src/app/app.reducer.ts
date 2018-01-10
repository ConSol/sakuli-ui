import {AppState, stateInit} from "./sakuli-admin/appstate.interface";
import {Action} from "@ngrx/store";
import {LOGOUT_SUCCESS} from "./sweetest-components/services/access/auth/auth.state";

export function appReducer(state: AppState, action: Action) {
  switch (action.type) {
    case LOGOUT_SUCCESS: {
      return stateInit;
    }
  }
  return state;
}
