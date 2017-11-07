import {EntityState} from "@ngrx/entity";

const NameCache = [];

export const uniqueName = <T extends string>(n: T) => {
  if(NameCache.indexOf(n) >= 0 ) {
    throw Error(`Name '${n}' is already in use`)
  }
  NameCache.push(n);
  return n;
};


export const notNull = (v: any): boolean => v != null;

export const log = (args: string) => (..._args: any[]) => console.log(args, ..._args);

export type MapFunction<T,R = any> = (e:T, i?:number, a?:T[]) => R
export const mapEntities = <T>(map:(T) => T, state: EntityState<T>, selectId:MapFunction<T> = (e: T) => e.toString()): EntityState<T> => {
  const entities = state.ids
    .map(k => state.entities[k])
    .map(map)
    .reduce((agg, e) => ({...agg, [selectId(e)]: e}), {});
  return ({
    ...state,
    entities
  });
}
