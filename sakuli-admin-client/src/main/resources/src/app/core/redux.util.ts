const NameCache = [];

export const Name = <T extends string>(n: T)=> {
  if(NameCache.indexOf(n) >= 0 ) {
    throw Error(`Name '${n}' is already in use`)
  }
  NameCache.push(n);
  return n;
}

export const notNull = (v: any): boolean => v != null;

export const log = (args: string) => (..._args: any[]) => console.log(args, ..._args);
