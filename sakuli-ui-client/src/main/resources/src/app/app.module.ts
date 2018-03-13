import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SakuliAdminModule} from './sakuli-admin/sakuli-admin.module';
import {SweetestComponentsModule} from "./sweetest-components";
import {ActionReducer, StoreModule} from "@ngrx/store";
import {ProjectOpenComponent} from "./sakuli-admin/workspace/project-open.component";
import {FormsModule} from "@angular/forms";
import {initStateFactory} from "./sakuli-admin/appstate.interface";

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    //console.group(action.type, action);
      //console.log('before', state);
      const result = reducer(state, action);
      //console.log('after', result);
    //console.groupEnd();
    return result;
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SakuliAdminModule,
    SweetestComponentsModule.forRoot(),
    StoreModule.forRoot({}, {
      initialState: initStateFactory,
      metaReducers: [debug]
    } ),
    //StoreDevtoolsModule.instrument({})
  ],
  entryComponents: [
    ProjectOpenComponent,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
