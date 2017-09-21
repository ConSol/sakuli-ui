import {InjectionToken, Type} from "@angular/core";

export const UTILIZED_ROOT = new InjectionToken<Type<any>[]>('ngrx-utils: utilized-root');
export const UTILIZED_FEATURE = new InjectionToken<Type<any>[][]>('ngrx-utils: utilized-feature');
