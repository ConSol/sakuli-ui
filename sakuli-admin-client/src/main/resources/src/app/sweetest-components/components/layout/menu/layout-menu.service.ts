import {Injectable} from "@angular/core";
import {IMenuItem} from "./menu-item.interface";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx'
import {Store} from "@ngrx/store"
import {AddMenuItem, menuSelectors, MenuState, SelectMenuItem} from "./menu.state";
import {EffectsRootModule} from "@ngrx/effects/src/effects_root_module";
import {Actions, Effect} from "@ngrx/effects";
import {ROUTER_NAVIGATION, RouterNavigationPayload, RouterNavigationAction, RouterAction} from "@ngrx/router-store";
import {Router, RouterStateSnapshot} from "@angular/router";
import {log, notNull} from "../../../../core/redux.util";

@Injectable()
export class LayoutMenuService {

  private static menuKeys = {
    SIDEBAR: 'sidebar',
    PRIMARY: 'primary',
    SECONDARY: 'secondary'
  };

  public static get Menus() {
    return LayoutMenuService.menuKeys;
  }

  addMenuItems(menuItems: IMenuItem[]) {
    menuItems.forEach(item => this.store.dispatch(new AddMenuItem(item)));
  }

  constructor(
    readonly store: Store<MenuState>,
    readonly actions$: Actions,
    readonly router: Router
  ) {}

  get(id: string): Observable<IMenuItem[]> {
    return this.store.select(menuSelectors.byParent(id));
  }

  @Effect() navigation$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((n: RouterNavigationAction) => n.payload.routerState.url)
    .mergeMap(url => this.store
      .select(menuSelectors.selectAll)
      .map(menuItems => menuItems.filter(m => {
        const link = this.router.serializeUrl(this.router.createUrlTree(m.link));
        return link === url;
      }))
      .map(menuItems => menuItems[0])
      .skipWhile(menuItems => menuItems == null)
      .first()
    )
    .map((m: IMenuItem) => new SelectMenuItem(m.id))
}
