import {Component, HostListener} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FontawesomeIcons} from "./sweetest-components/components/presentation/icon/fontawesome-icon.utils";
import {Router} from "@angular/router";
import {AppState} from "./sakuli-admin/appstate.interface";
import {Store} from "@ngrx/store";
import {LayoutMenuService} from "./sweetest-components/components/layout/menu/layout-menu.service";
import {IMenuItem, MenuItem} from "./sweetest-components/components/layout/menu/menu-item.interface";
import {SelectMenuItem} from "./sweetest-components/components/layout/menu/menu.state";
import {SelectionState} from "./sweetest-components/model/tree";
import {RouterGo} from "./sweetest-components/services/router/router.actions";
import {TokenService} from "./sweetest-components/services/access/token.service";
import {ScFileSelectorService} from "./sweetest-components/components/presentation/file-selector/sc-file-selector.service";
import {OpenWorkspace} from "./sakuli-admin/workspace/state/project.actions";
import {Filters} from "./sweetest-components/components/presentation/file-selector/file-selector-filter.interface";

@Component({
  selector: 'app-root',
  template: `
    <sc-layout brandLogo="assets/sakuli_logo_small.png"
               (menuItemSelected)="onLink($event)"
    >
      <router-outlet></router-outlet>
    </sc-layout>
  `
})
export class AppComponent {

  @HostListener('window:beforeunload', ['$event'])
  hostBeforeUnload() {
    if(!window['preventStatePersistance']) {
      this.store.select(s => s).first().subscribe(s => {
        sessionStorage.setItem("sakuli-admin-state", JSON.stringify(s))
      });
      this.tokenService.persistToken();
    }
  }

  constructor(readonly menuService: LayoutMenuService,
              readonly router: Router,
              readonly store: Store<AppState>,
              readonly modal: NgbModal,
              readonly tokenService: TokenService,
              readonly fileSelector: ScFileSelectorService
  ) {

    this.menuService.addMenuItems(
      [
        new MenuItem('secondary.log', 'Log', 'app-log', FontawesomeIcons.commentingO, LayoutMenuService.Menus.SECONDARY, SelectionState.UnSelected, 10),
        new MenuItem('secondary.help', 'Help', '', FontawesomeIcons.questionCircle, LayoutMenuService.Menus.SECONDARY, SelectionState.UnSelected, 20),
      ]
    );

    this.menuService.addMenuItems(
      [
        new MenuItem(
          'primary.new',
          'New',
          'new',
          FontawesomeIcons.plus,
          LayoutMenuService.Menus.PRIMARY,
          SelectionState.UnSelected,
          10),
        new MenuItem(
          'primary.open',
          'Open',
          'testSuite/open',
          FontawesomeIcons.folderO,
          LayoutMenuService.Menus.PRIMARY,
          SelectionState.UnSelected,
          20
        ),
        new MenuItem('sidebar.dashboard',
          'Dashboard', '',
          FontawesomeIcons.dashboard,
          LayoutMenuService.Menus.PRIMARY,
          SelectionState.UnSelected,
          30
        ),

        new MenuItem('sidebar.reports',
          'Reports', 'reports',
          FontawesomeIcons.tasks,
          LayoutMenuService.Menus.PRIMARY,
          SelectionState.UnSelected,
          40
        ),
      ]
    );

  }

  async onLink(item: IMenuItem) {
    this.store.dispatch(new SelectMenuItem(item.id));
    if (item.link[0] === 'testSuite/open') {
      try {
        const [file] = await this.fileSelector.openModal({
          root: '',
          inactive: Filters.isFile()
        });
        console.log(file);
        this.store.dispatch(new OpenWorkspace(file));
      } catch(e) {
        console.warn(e, new OpenWorkspace(null));
      }
    } else {
      this.store.dispatch(new RouterGo({path: item.link, extras: {queryParams: item.queryParams || {}}}));
    }
  }
}
