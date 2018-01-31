import {FontawesomeIcon} from "../../presentation/icon/fontawesome-icon.utils";
import {ITreeItem, SelectionState} from "../../../model/tree";
import {Action} from "@ngrx/store";

export interface IMenuItem extends ITreeItem {
  icon: FontawesomeIcon,
  label: string,
  link?: string[],
  order: number;
  action?: Action
  queryParams: {[key:string]:string}
}

export class MenuItem implements IMenuItem{
  readonly parent: string;
  readonly link: string[];
  readonly queryParams: {};
  readonly action;
  constructor(
    readonly id: string,
    readonly label: string,
    readonly _link: string | string[] | Action,
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
    } else if(Array.isArray(_link)) {
      this.link = _link;
    } else {
      this.action = _link;
    }
  }

}
