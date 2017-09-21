

export function isPromiseLike<T = any>(o: any): o is PromiseLike<T> {
  return 'then' in o && typeof o.then === 'function';
}
