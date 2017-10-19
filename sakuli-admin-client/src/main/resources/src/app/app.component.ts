import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LayoutMenuService} from "./sweetest-components/components/layout/layout-menu.service";
import {FontawesomeIcons} from "./sweetest-components/components/presentation/icon/fontawesome-icon.utils";
import {Router} from "@angular/router";
import {MenuItem} from "./sweetest-components/components/layout/menu-item.interface";
import {ProjectOpenComponent} from "./sakuli-admin/project/project-open.component";

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

  constructor(private menuService: LayoutMenuService,
              private router: Router,
              private modal: NgbModal) {

    this.menuService.defineMenu(
      LayoutMenuService.Menus.PRIMARY, [
        {label: 'New', icon: FontawesomeIcons.plus, link: '', children: []},
        {label: 'Open', icon: FontawesomeIcons.folderOpen, link: 'project/open', children: []}
      ]
    );

    this.menuService.defineMenu(
      LayoutMenuService.Menus.SECONDARY, [
        {label: 'Log', icon: FontawesomeIcons.filesO, link: 'app-log', children: []},
        {label: '', icon: FontawesomeIcons.questionCircle, link: '', children: []}
      ]
    );

    this.menuService.defineMenu(
      LayoutMenuService.Menus.SIDEBAR, [
        {label: 'Dashboard', icon: FontawesomeIcons.dashboard, link: '', children: []},
        {
          label: 'Testsuite', icon: FontawesomeIcons.cubes, link: 'test', children: [
          {label: 'Sources', icon: FontawesomeIcons.code, link: 'test/sources'},
          {label: 'Assets', icon: FontawesomeIcons.image, link: 'test/assets'},
          {label: 'Configuration', icon: FontawesomeIcons.wrench, link: 'test/configuration', children: []},
          {label: 'Reports', icon: FontawesomeIcons.tasks, link: 'test/reports', children: []}
        ]
        },
        // {label: 'Test Report', icon: FontawesomeIcons.tasks, link: '', children: []},
        // {label: 'Settings', icon: FontawesomeIcons.cogs, link: '', children: []}
      ]
    );

  }

  onLink(item: MenuItem) {
    if (item.link === 'project/open') {
      this.modal.open(ProjectOpenComponent);
    } else {
      this.router.navigate([item.link]);
    }
  }
}
