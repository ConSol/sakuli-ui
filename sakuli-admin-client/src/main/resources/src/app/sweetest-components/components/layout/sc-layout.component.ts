import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {MenuItem} from "./menu-item.interface";
import {LayoutMenuService} from "./layout-menu.service";
import {Observable} from "rxjs/Observable";

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
          <sc-toast-container></sc-toast-container>
          <ng-content></ng-content>
        </div>
      </div>
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

  @Output() menuItemSelected = new EventEmitter<MenuItem>();

  primaryMenuItems$: Observable<MenuItem[]>;
  secondaryMenuItems$: Observable<MenuItem[]>;
  sidebarMenuItems$: Observable<MenuItem[]>;

  constructor(private menuService: LayoutMenuService) {
  }

  ngOnInit() {
    this.primaryMenuItems$ = this.menuService.get(LayoutMenuService.Menus.PRIMARY)
    this.secondaryMenuItems$ = this.menuService.get(LayoutMenuService.Menus.SECONDARY)
    this.sidebarMenuItems$ = this.menuService.get(LayoutMenuService.Menus.SIDEBAR)

  }

  onMenuItemSelected(menuItem: MenuItem) {
    this.menuItemSelected.next(menuItem);
  }

}
