import {Action, createFeatureSelector, createSelector} from "@ngrx/store";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {IMenuItem} from "./menu-item.interface";
import {SelectionState} from "../../../model/tree";
import {castStringArray, mapEntities, uniqueName} from "../../../../core/redux.util";

export const ScMenuFeatureName = 'scMenu';

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

export const REMOVE_MENUITEM_BY_PARENT = '[MENUITEM] REMOVE BY PARENT';
export class RemoveByParentMenuitem implements Action {
  readonly type = REMOVE_MENUITEM_BY_PARENT;
  constructor(
    readonly parent?: string
  ) {}
}

export const REMOVE_MENUITEM = '[MENUITEM] REMOVE';
export class RemoveMenuitem implements Action {
  readonly type = REMOVE_MENUITEM;
  constructor(
    readonly id: string,
  ) {}
}

export const INVOKE_MENUITEM = '[MENUITEM] INVOKE';
export class InvokeMenuitem implements Action {
  readonly type = INVOKE_MENUITEM;
  constructor(
    readonly item: IMenuItem
  ) {}
}


const _menuSelectors = menuEntityAdapter.getSelectors(createFeatureSelector<MenuState>(ScMenuFeatureName));

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

export type MenuActions = AddMenuItem | AddAllMenuItems | SelectMenuItem | RemoveByParentMenuitem | RemoveMenuitem;

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
    case REMOVE_MENUITEM_BY_PARENT: {
      const {parent} = action;
      if(parent) {
        const toDelete = Object.keys(state.entities).filter(k => state.entities[k].parent === parent);
        return menuEntityAdapter.removeMany(toDelete, state);
      } else {
        return menuEntityAdapter.removeAll(state);
      }
    }
    case REMOVE_MENUITEM: {
      const {id} = action;
      return menuEntityAdapter.removeOne(id, state);
    }
    default:
      return state || menuStateInit
  }
}
