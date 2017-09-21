export type Constructor<T = {}> = new (...args: any[]) => T;

function Mixin<MBase extends Constructor>(Base: MBase) {
  return class extends Base {}
}
