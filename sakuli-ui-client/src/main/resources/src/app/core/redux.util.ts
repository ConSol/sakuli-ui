import {EntityState} from "@ngrx/entity";

const NameCache = [];

export const uniqueName = <T extends string>(n: T) => {
  if(NameCache.indexOf(n) >= 0 ) {
    throw Error(`Name '${n}' is already in use`)
  }
  NameCache.push(n);
  return n;
};

/**
 * Just a wrapper for EntityState:ids field which could be a number[] or a string[]
 * and this confuses TS in some cases :/
 * @param {any[]} a
 * @returns {string[]}
 */
export const castStringArray = (a: number[] | string[]): string[] => a as string[];

export const notNull = (v: any): boolean => v != null;

export const log = (args: string) => (..._args: any[]) => console.log(args, ..._args);

export type MapFunction<T,R = any> = (e:T, i?:number, a?:T[]) => R
export const mapEntities = <T>(map:(T) => T, state: EntityState<T>, selectId:MapFunction<T> = (e: T) => e.toString()): EntityState<T> => {
  const entities = castStringArray(state.ids)
    .map(k => state.entities[k])
    .map(map)
    .reduce((agg, e) => ({...agg, [selectId(e)]: e}), {});
  return ({
    ...state,
    entities
  });
};

export const logTiming = <T extends Function>(fn: T) => {
  return (...args: any[]) => {
    console.time(fn.name);
    const r = fn(...args);
    console.timeEnd(fn.name);
    return r;
  }
};
