import {Component, HostListener, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FontawesomeIcons} from "./sweetest-components/components/presentation/icon/fontawesome-icon.utils";
import {Router} from "@angular/router";
import {AppState} from "./sakuli-admin/appstate.interface";
import {Store} from "@ngrx/store";
import {LayoutMenuService} from "./sweetest-components/components/layout/menu/layout-menu.service";
import {IMenuItem, MenuItem} from "./sweetest-components/components/layout/menu/menu-item.interface";
import {
  AddMenuItem, InvokeMenuitem, RemoveMenuitem,
  SelectMenuItem
} from "./sweetest-components/components/layout/menu/menu.state";
import {SelectionState} from "./sweetest-components/model/tree";
import {OpenWorkspaceDialog} from "./sakuli-admin/workspace/state/project.actions";
import {Actions} from "@ngrx/effects";
import {authSelectors, Logout} from "./sweetest-components/services/access/auth/auth.state";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  template: `
    <sc-layout brandLogo="assets/sakuli_logo_small.png"
               (menuItemSelected)="onLink($event)"
               [sideBar]="showSideBar$ | async"
    >
      <router-outlet></router-outlet>
    </sc-layout>
  `
})
export class AppComponent implements OnInit {

  showSideBar$: Observable<boolean>;

  ngOnInit(): void {
    this.showSideBar$ = this.store.select(authSelectors.isLoggedIn());
    this.showSideBar$
      .distinctUntilChanged()
      .subscribe(loggedIn => {
        const actions = [];
        if(loggedIn) {
          actions.push(new RemoveMenuitem(this.logInButton.id));
          actions.push(new AddMenuItem(this.logOutButton));
        } else {
          actions.push(new RemoveMenuitem(this.logOutButton.id));
          actions.push(new AddMenuItem(this.logInButton));
        }
        actions.forEach(a => this.store.dispatch(a));
      })
  }

  @HostListener('window:beforeunload', ['$event'])
  hostBeforeUnload() {
    if (!window['preventStatePersistance']) {
      this.store.select(s => s).first().subscribe(s => {
        sessionStorage.setItem("sakuli-admin-state", JSON.stringify(s))
      });
    }
  }

  logInButton = new MenuItem(
    'secondary.login',
    'Login',
    '/login',
    FontawesomeIcons.signIn,
    LayoutMenuService.Menus.SECONDARY,
    SelectionState.UnSelected,
    99
  );

  logOutButton = new MenuItem(
    'secondary.login',
    'Logout',
    new Logout(),
    FontawesomeIcons.signOut,
    LayoutMenuService.Menus.SECONDARY,
    SelectionState.UnSelected,
    99
  );

  constructor(readonly menuService: LayoutMenuService,
              readonly router: Router,
              readonly store: Store<AppState>,
              readonly modal: NgbModal,
              readonly actions: Actions) {

    this.menuService.addMenuItems(
      [
        new MenuItem('secondary.log', 'Log', '/app-log', FontawesomeIcons.commentingO, LayoutMenuService.Menus.SECONDARY, SelectionState.UnSelected, 10),
        new MenuItem('secondary.help', 'Help', '', FontawesomeIcons.questionCircle, LayoutMenuService.Menus.SECONDARY, SelectionState.UnSelected, 20),
      ]
    );

    this.menuService.addMenuItems(
      [
        /*
        new MenuItem(
          'primary.new',
          'New',
          'new',
          FontawesomeIcons.plus,
          LayoutMenuService.Menus.PRIMARY,
          SelectionState.UnSelected,
          10),
        */
        new MenuItem(
          'primary.open',
          'Open',
          new OpenWorkspaceDialog(),
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
    this.store.dispatch(new InvokeMenuitem(item));
  }
}
