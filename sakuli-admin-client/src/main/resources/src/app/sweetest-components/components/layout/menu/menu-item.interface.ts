import {FontawesomeIcon} from "../../presentation/icon/fontawesome-icon.utils";
import {SelectionState, ITreeItem} from "../../../model/tree";

export interface IMenuItem extends ITreeItem {
  icon: FontawesomeIcon,
  label: string,
  link: string[],
  order: number;
}

export class MenuItem implements IMenuItem{
  readonly parent: string;
  readonly link: string[];
  constructor(
    readonly id: string,
    readonly label: string,
    readonly _link: string | string[],
    readonly icon: FontawesomeIcon = 'fa-external-link',
    parentItem: IMenuItem | string,
    readonly selected: SelectionState = SelectionState.UnSelected,
    readonly order = 0
  ) {
    if(typeof parentItem === 'string') {
      this.parent = `${parentItem}`;
    } else {
      this.parent = `${parentItem.id}`;
    }
    if(typeof _link === 'string') {
      this.link = [_link];
    } else {
      this.link = _link;
    }
  }

}
