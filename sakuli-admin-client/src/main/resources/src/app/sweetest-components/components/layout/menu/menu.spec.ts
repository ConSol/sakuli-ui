import {
  AddAllMenuItems, menuEntityAdapter, menuReducer, menuSelectors, MenuState, SELECT_MENUITEM,
  SelectMenuItem
} from "./menu.state";
import {IMenuItem, MenuItem} from "./menu-item.interface";
import {SelectionState} from "../../../model/tree";
import {TestBed} from "@angular/core/testing";
import {Store, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {LayoutMenuService} from "./layout-menu.service";
import {provideMockActions} from "@ngrx/effects/testing";
import {Observable} from "rxjs/Observable";
import Mocked = jest.Mocked;
import {ScMenuModule} from "./menu.module";
import {AppState} from "../../../../sakuli-admin/appstate.interface";
import {marbles} from "rxjs-marbles";
import {ROUTER_NAVIGATION} from "@ngrx/router-store";


describe('Menu', () => {
  const icon = 'fa-code';
  const root = 'root';
  const p1 = new MenuItem('p1', 'P1', 'p1', icon, root);
  const c11 = new MenuItem('p1.c11', 'C11', 'p1/c11', icon, p1);
  const c12 = new MenuItem('p1.c12', 'C12', 'p1/c12', icon, p1);
  const c13 = new MenuItem('p1.c13', 'C13', 'p1/c13', icon, p1);
  const p2 = new MenuItem('p2', 'P2', 'p2', icon, root);
  const addAllItemsAction = new AddAllMenuItems([p1, c11, c12, c13, p2]);

  describe('reducer', () => {

    let state: MenuState;
    beforeEach(() => {
      state = menuReducer(
        menuEntityAdapter.getInitialState(),
        addAllItemsAction
      )
    });

    it('should select byParent', () => {
      const selection = menuSelectors.byParent(p1.id)({scMenu: state});
      expect(selection.length).toBe(3);
    });

    it(`should handle ${SELECT_MENUITEM}`, () => {
      const _state = menuReducer(
        state, new SelectMenuItem('p1.c12')
      );
      const _p1: IMenuItem = _state.entities['p1'];
      const _c12: IMenuItem = _state.entities['p1.c12'];

      expect(SelectionState[_p1.selected]).toBe(SelectionState[SelectionState.Indeterminate]);
      expect(SelectionState[_c12.selected]).toBe(SelectionState[SelectionState.Selected]);
    });

  });

  describe('Effects', () => {
    let mockActions: Observable<any>;
    let store: Store<AppState>;
    let effects: LayoutMenuService;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          ScMenuModule,
          EffectsModule.forRoot([])
        ],
        providers: [
          LayoutMenuService,
          provideMockActions(() => mockActions),
        ]
      });
      store = TestBed.get(Store);
      effects = TestBed.get(LayoutMenuService);
    });

    it('should select on Navigation', marbles(m => {
      store.dispatch(addAllItemsAction);
      mockActions = m.hot('---a-', {
        a: { type: ROUTER_NAVIGATION, payload: {routerState: {url: 'p1/c11'} }}
      });
      const expected = m.cold('---a-', {
        a: new SelectMenuItem('p1.c11')
      });
      m.expect(effects.navigation$).toBeObservable(expected);
    }))
  })

});
