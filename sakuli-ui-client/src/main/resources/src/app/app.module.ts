import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SakuliAdminModule} from './sakuli-admin/sakuli-admin.module';
import {SweetestComponentsModule} from "./sweetest-components";
import {INITIAL_STATE, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {ProjectOpenComponent} from "./sakuli-admin/workspace/project-open.component";
import {FormsModule} from "@angular/forms";
import {initStateFactory} from "./sakuli-admin/appstate.interface";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SakuliAdminModule,
    SweetestComponentsModule.forRoot(),
    StoreModule.forRoot({} ),
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
