export enum SelectionState {
  Selected, Indeterminate, UnSelected
}

export interface ITreeItem {
  id: string;
  parent: string;
  selected: SelectionState
}

export class MaterializedTree<T extends ITreeItem> {

  private items: {[id:string]:ITreeItem} = {};

  constructor(...items: T[]){
    this.items = items.reduce((e, i) => ({...e, [i.id]: i}), {});
  }

  getChildren(item: ITreeItem) {
  }

  get keys() {
    return Object.keys(this.items);
  }

  asArray() {
    return this.keys.map(k => this.items[k]);
  }
}
