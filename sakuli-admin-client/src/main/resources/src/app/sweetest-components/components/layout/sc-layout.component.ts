import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {IMenuItem} from "./menu/menu-item.interface";
import {LayoutMenuService} from "./menu/layout-menu.service";
import {log} from "../../../core/redux.util";

@Component({
  selector: 'sc-layout',
  template: `
    <main>
      <sc-header [brandLogo]="brandLogo"
                 [brandName]="brandName"
                 [primaryMenuItems]="primaryMenuItems$ | async"
                 [secondaryMenuItems]="secondaryMenuItems$ | async"
                 (menuItemSelected)="onMenuItemSelected($event)"
      ></sc-header>
      <div class="flex-row" [style.display]="'flex'">
        <sc-sidebar
        [menuItems]="sidebarMenuItems$ | async"
        (menuItemSelected)="onMenuItemSelected($event)"
        ></sc-sidebar>
        <div class="content-outlet">
          <ng-content></ng-content>
        </div>
      </div>
      <sc-toast-container></sc-toast-container>
    </main>
  `,
  styles: [`

    sc-sidebar {
      flex: 0 1 100%;
    }

    .content-outlet {
      flex: 1 1;
      min-height: calc(100vh - 64px);
      position: relative;
    }
    
    sc-toast-container {
      position: absolute;
      width: 100%;
    }
  `]
})
export class ScLayoutComponent implements OnInit {

  @Input() brandName: string;
  @Input() brandLogo: string;

  @Output() menuItemSelected = new EventEmitter<IMenuItem>();

  primaryMenuItems$: Observable<IMenuItem[]>;
  secondaryMenuItems$: Observable<IMenuItem[]>;
  sidebarMenuItems$: Observable<IMenuItem[]>;

  constructor(private menuService: LayoutMenuService) {
  }

  ngOnInit() {
    this.primaryMenuItems$ = this.menuService.get(LayoutMenuService.Menus.PRIMARY);
    this.secondaryMenuItems$ = this.menuService.get(LayoutMenuService.Menus.SECONDARY);
    this.sidebarMenuItems$ = this.menuService.get(LayoutMenuService.Menus.SIDEBAR).do(log("Menu"));
  }

  onMenuItemSelected(menuItem: IMenuItem) {
    this.menuItemSelected.next(menuItem);
  }

}
