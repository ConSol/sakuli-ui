import {NgModule} from '@angular/core';
import {LayoutMenuService} from "./layout-menu.service";
import {StoreModule} from "@ngrx/store";
import {menuReducer} from "./menu.state";
import {EffectsModule} from "@ngrx/effects";

@NgModule({
  imports: [
    StoreModule.forFeature("scMenu", menuReducer),
    EffectsModule.forFeature([LayoutMenuService])
  ],
  exports: [],
  declarations: [],
  providers: [
    LayoutMenuService
  ],
})
export class ScMenuModule {
}
