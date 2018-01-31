import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SakuliAdminModule} from './sakuli-admin/sakuli-admin.module';
import {SweetestComponentsModule} from "./sweetest-components/index";
import {ActionReducer, INITIAL_STATE, MetaReducer, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {ProjectOpenComponent} from "./sakuli-admin/workspace/project-open.component";
import {FormsModule} from "@angular/forms";
import {initStateFactory, stateInit} from "./sakuli-admin/appstate.interface";
import {LOGOUT_SUCCESS} from "./sweetest-components/services/access/auth/auth.state";
import {ScMenuFeatureName} from "./sweetest-components/components/layout/menu/menu.state";

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  const preventResetFor = [ScMenuFeatureName];
  return function(state, action) {

    if(action.type === LOGOUT_SUCCESS) {
      const reseted = Object.keys(state)
        .reduce((s, k) => {
          return ({
            ...s,
            [k]: preventResetFor.includes(k) ? s[k] : stateInit[k]
          })
        }, state)
      return reducer(reseted, action);
    } else {
      return reducer(state, action);
    }
  }
}


export const metaReducers: MetaReducer<any>[] = [debug];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SakuliAdminModule,
    SweetestComponentsModule.forRoot(),
    StoreModule.forRoot({}, { metaReducers }),
    StoreDevtoolsModule.instrument({})
  ],
  entryComponents: [
    ProjectOpenComponent,

  ],
  providers: [
    {
      provide: INITIAL_STATE,
      useFactory: initStateFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
