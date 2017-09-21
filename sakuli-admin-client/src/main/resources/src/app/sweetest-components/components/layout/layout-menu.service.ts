import {Injectable} from "@angular/core";
import {MenuItem} from "./menu-item.interface";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx'
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class LayoutMenuService extends BehaviorSubject<Map<symbol|string, MenuItem[]>> {

  private static menuKeys = {
    SIDEBAR: Symbol('sidebar'),
    PRIMARY: Symbol('primary'),
    SECONDARY: Symbol('secondary')
  }

  public static get Menus() {
    return LayoutMenuService.menuKeys;
  }

  private menus:Map<symbol|string, MenuItem[]>;

  constructor() {
    const menus = new Map<symbol|string, MenuItem[]>();
    super(menus);
    this.menus = menus;
  }

  defineMenu(menu: symbol|string, items: MenuItem[]) {
    this.menus.set(menu, items);
    this.next(this.menus);
  }

  get(id: symbol|string): Observable<MenuItem[]> {
    return this.asObservable().map(m => m.get(id));
  }
}
