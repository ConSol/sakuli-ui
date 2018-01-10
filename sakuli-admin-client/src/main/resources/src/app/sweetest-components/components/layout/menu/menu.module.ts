import {NgModule} from '@angular/core';
import {LayoutMenuService} from "./layout-menu.service";
import {StoreModule} from "@ngrx/store";
import {menuReducer, ScMenuFeatureName} from "./menu.state";
import {EffectsModule} from "@ngrx/effects";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    StoreModule.forFeature(ScMenuFeatureName, menuReducer),
    EffectsModule.forFeature([LayoutMenuService]),
    RouterModule.forChild([])
  ],
  providers: [
    LayoutMenuService,
    RouterModule
  ],
})
export class ScMenuModule {
}
