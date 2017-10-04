export const uniq = <T>(array: T[], idFactory: (e: T) => string) => {
  return Array.from(
    array
      .reduce((m, e) => {
        const id = idFactory(e);
        if (!m.has(id)) {
          m.set(id, e);
        }
        return m;
      }, new Map())
      .values()
  );
};

export function nothrowFn<P1, R>(cb: (p1: P1) => R, defaultValue?: R): (p1: P1) => R;
export function nothrowFn<P1, P2, R>(cb: (p1: P1, p2: P2) => R,  defaultValue?: R): (p1: P1, p2: P2) => R;
export function nothrowFn<P1, P2, P3, R>(cb: (p1: P1, p2: P2, p3: P3) => R,  defaultValue?: R): (p1: P1, p2: P2, p3: P3) => R;
export function nothrowFn(cb: (...args: any[]) => any,  defaultValue: any = undefined): (...args: any[]) => any {
  return (function (...args: any[]) {
    try {
      return cb(...args);
    } catch (e) {
      return defaultValue;
    }
  })
}
