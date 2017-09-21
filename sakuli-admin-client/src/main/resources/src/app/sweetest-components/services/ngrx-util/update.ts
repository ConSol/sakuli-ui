import {Action} from "@ngrx/store";

export interface UpdateOperator<T> {
  (value: Partial<T>): T
}

export type  UpdateCommand<T> = {
  [P in keyof T]: T[P] | UpdateOperator<T[P]> | UpdateCommand<T[P]>
}

export const set = (o: any, ...path: any[]) => {
  return (value: any) => {
    let dest;
    if (path.length > 1) {
      dest = path.slice(0, -1).reduce((pi, pe) => pi[pe], o);
    } else {
      dest = o;
    }
    dest[path.pop()] = value;
  }
}

export const STATE_UPDATE_TYPE = '[ngrx-utils]: update';

export class StateUpdate<T> implements Action {
  readonly type = STATE_UPDATE_TYPE;

  constructor(readonly command: UpdateCommand<Partial<T>>) {
  }
}

function isFunction(o: any): o is Function {
  return typeof o === 'function';
}

type PartialDeep<T> = {
  [P in keyof T]?: Partial<T[P]>;
  };


export function update<S>(state: S, command: UpdateCommand<Partial<S>>): S {
  if ('object' !== typeof command) {
    return state || command;
  } else {
    return Object.keys(command).reduce((co, key: keyof UpdateCommand<S>) => {
      const cmd = command[key];
      if(isFunction(cmd)) {
        co[key] = cmd(state[key] as any);
      } else {
        co[key] = update(state[key], command[key] as any);
      }
      return {...state as any, ...co as any};
    }, {} as Partial<S>) as S;
  }
}

export function stateUpdateReducer<T>(state: T, action: StateUpdate<T>) {
  if (action.type === STATE_UPDATE_TYPE) {
    return update(state, action.command as any);
  }
  return state;
}

export const $merge = <T extends object>(extension: UpdateCommand<any>): any => {
  return (old: T) => {
    return {...old as object, ...update(old, extension as any) as object} as any;
  }
};

export const $push = <T>(value: any): UpdateOperator<T> => {
  return (old: any) => {
    if (Array.isArray(old)) {
      return [...old, value];
    } else {
      return old;
    }
  }
}

export const $concat = <T>(value: T[]): UpdateOperator<T[]> => {
  return (old: T[]) => {
    if (Array.isArray(old)) {
      return [...old, ...value];
    } else {
      return old;
    }
  }
};


export const $pipe = <T>(...args: UpdateOperator<T>[]) => {
  return (old: any) => {
    return args.reduce((lastResult: T, fn: any) => fn(lastResult), old);
  }
};

export const $filter = <T>(predicate: (o:T) => boolean): UpdateOperator<T[]> => {
  return (old: T[]) => {
    if(Array.isArray(old)) {
      return old.filter(predicate);
    } else {
      return old;
    }
  }
}
