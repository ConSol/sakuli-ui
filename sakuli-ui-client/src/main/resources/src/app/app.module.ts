import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SakuliAdminModule} from './sakuli-admin/sakuli-admin.module';
import {SweetestComponentsModule} from "./sweetest-components";
import {StoreModule} from "@ngrx/store";
import {ProjectOpenComponent} from "./sakuli-admin/workspace/project-open.component";
import {FormsModule} from "@angular/forms";
import {initStateFactory} from "./sakuli-admin/appstate.interface";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";


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
      metaReducers: []
    } ),
    ...(environment.production
      ? []
      : [StoreDevtoolsModule.instrument({})])
  ],
  entryComponents: [
    ProjectOpenComponent,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
