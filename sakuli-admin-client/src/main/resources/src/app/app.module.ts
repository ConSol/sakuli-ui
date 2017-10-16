import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {SakuliAdminModule} from './sakuli-admin/sakuli-admin.module';
import {SweetestComponentsModule} from "./sweetest-components/index";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {ProjectOpenComponent} from "./sakuli-admin/project/project-open.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SakuliAdminModule,
    SweetestComponentsModule.forRoot(),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({})
  ],
  entryComponents: [
    ProjectOpenComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
