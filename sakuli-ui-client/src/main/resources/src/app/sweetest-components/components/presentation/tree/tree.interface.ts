export interface TreeItem<T> {open: boolean, busy: boolean, children: Tree<T>[]
}

export type Tree<T> = T & TreeItem<T>;
