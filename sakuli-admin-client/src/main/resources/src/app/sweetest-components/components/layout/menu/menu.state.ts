import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {IMenuItem} from "./menu-item.interface";
import {SelectionState} from "../../../model/tree";
import {castStringArray, mapEntities, uniqueName} from "../../../../core/redux.util";

export const menuSelectId = (menuItem: IMenuItem) => menuItem.id;

export interface MenuState extends EntityState<IMenuItem> {}

export const menuEntityAdapter = createEntityAdapter({
  selectId: menuSelectId,
  sortComparer: (e1, e2) => e1.order - e2.order
});

export const ADD_MENUITEM = uniqueName('[MENUITEM] ADD');
export class AddMenuItem implements Action {
  readonly type = ADD_MENUITEM;

  constructor(readonly menuItem: IMenuItem) {
  }
}

export const ADDALL_MENUITEMS = uniqueName('[MENUITEM] ADDALL');
export class AddAllMenuItems implements Action {
  readonly type = ADDALL_MENUITEMS;
  constructor(
    readonly menuItems: IMenuItem[]
  ) {}
}

export const SELECT_MENUITEM = uniqueName('[MENUITEM] SELECT');
export class SelectMenuItem implements Action {
  readonly type = SELECT_MENUITEM;
  constructor(
    readonly id: string
  ) {}
}

const _menuSelectors = menuEntityAdapter.getSelectors(createFeatureSelector<MenuState>('scMenu'));

const byParent = (parent: string) => createSelector(
  _menuSelectors.selectAll,
  (items: IMenuItem[]) => {
    return items.filter(item => item.parent === parent)
  }
);

export const menuSelectors = {
  ..._menuSelectors,
  byParent
};

export type MenuActions = AddMenuItem | AddAllMenuItems | SelectMenuItem;

export const menuStateInit = menuEntityAdapter.getInitialState();
export function menuReducer(state: MenuState, action: MenuActions) {

  function addOrUpdateOne(state: MenuState, item:IMenuItem) {
    const id: string = menuSelectId(item);
    return castStringArray(state.ids).includes(id)
      ? menuEntityAdapter.updateOne({id, changes: item}, state)
      : menuEntityAdapter.addOne(item, state)
  }

  switch(action.type) {
    case ADDALL_MENUITEMS: {
      return action.menuItems.reduce(addOrUpdateOne, state);
    }
    case ADD_MENUITEM: {
      return addOrUpdateOne(state, action.menuItem);
    }
    case SELECT_MENUITEM: {
      const map = entity => ({
        ...entity,
        selected: menuSelectId(entity) === action.id ? SelectionState.Selected : (action.id.startsWith(menuSelectId(entity))) ? SelectionState.Indeterminate : SelectionState.UnSelected
      });
      return mapEntities(map, state, menuSelectId);
    }
    default:
      return state || menuStateInit
  }
}
