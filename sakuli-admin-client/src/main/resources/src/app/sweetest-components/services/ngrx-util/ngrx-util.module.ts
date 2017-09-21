import {ModuleWithProviders, NgModule, Type} from "@angular/core";
import {Store} from "@ngrx/store";
import {UTILIZED_FEATURE, UTILIZED_ROOT} from "./di-tokens";
import {NgrxUtilFeatureModule} from "./ngrx-util-feature.module";
import {NgrxUtilRootModule} from "app/sweetest-components/services/ngrx-util/ngrx-util-root.module";


export function dumbFactory(...args: any[]) {
  return args
}

@NgModule({
  exports: [NgrxUtilRootModule, NgrxUtilFeatureModule]
})
export class NgrxUtilModule {

  public static forRoot(utilized: Type<any>[] = []): ModuleWithProviders {
    return ({
      ngModule: NgrxUtilRootModule,
      providers: [
        utilized,
        Store,
        {
          provide: UTILIZED_ROOT,
          deps: utilized,
          useFactory: dumbFactory
        }
      ]
    })
  }

  public static forFeature(utilized: Type<any>[] = []): ModuleWithProviders {
    return ({
      ngModule: NgrxUtilFeatureModule,
      providers: [
        ...utilized,
        {
          provide: UTILIZED_FEATURE,
          multi: true,
          deps: utilized,
          useFactory: dumbFactory
        }
      ]
    })
  }


}
