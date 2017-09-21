import {Inject, NgModule, Type} from "@angular/core";
import {UTILIZED_FEATURE, UTILIZED_ROOT} from "./di-tokens";
import {NgrxUtilRootModule} from "./ngrx-util-root.module";

const r: any = Reflect;

@NgModule({})
export class NgrxUtilFeatureModule {

  constructor(
    private root: NgrxUtilRootModule,
    @Inject(UTILIZED_FEATURE) private utilized: Type<any>[][],
  ) {
    utilized
      .forEach(group => group
        .forEach(serviceInstance => root.addUtilizedClass(serviceInstance)
        )
      );
  }

}
