import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Theme} from "../theme";
import {ActivatedRoute, Router} from "@angular/router";
import {IMenuItem} from "./menu/menu-item.interface";
import {AppState} from "../../../sakuli-admin/appstate.interface";
import {Store} from "@ngrx/store";
import {menuSelectors} from "./menu/menu.state";
import {SelectionState} from "../../model/tree";
import {FontawesomeIcons} from "../presentation/icon/fontawesome-icon.utils";
import {workpaceSelectors} from "../../../sakuli-admin/workspace/state/project.interface";
import {NavigateToTestSuiteAssets} from "../../../sakuli-admin/test/state/test-navitation.actions";

@Component({
  selector: 'sc-sidebar',
  template: `
    <ul class="nav flex-column">
      <ng-container *ngFor="let menuItem of menuItems">
        <sc-link [fixedIconWidth]="true"
                 [icon]="menuItem.icon"
                 (click)="onMenuItemSelected(menuItem)"
                 [ngStyle]="{order: menuItem.order}"
        >
          <span class="hidden-md-down link-text">
          {{menuItem.label}}
          </span>
          <span class="actions mr-lg-0 mr-sm-3">
            <button 
              class="ml-1 btn btn-sm rounded btn-success"
              [ngbTooltip]="'Run ' + menuItem.label"
              placement="right"
            >
              <sc-icon
                icon="fa-play"
                (click)="onMenuItemSelected(menuItem, {autorun:'1'})"
              ></sc-icon>
            </button>
          </span>
        </sc-link>
        <ul *ngIf="isActive(menuItem)" [ngStyle]="{order: menuItem.order}">
          <sc-link *ngFor="let childItem of childrenFor$(menuItem.id) | async"
                   [fixedIconWidth]="true"
                   [icon]="childItem.icon"
                   (click)="onMenuItemSelected(childItem)"
          >
            <span class="hidden-xs-down link-text">{{childItem.label}}</span>
          </sc-link>
        </ul>
      </ng-container>
      <sc-link [fixedIconWidth]="true"
               icon="fa-files-o"
               *ngIf="workspace$ | async"
               (click)="navigateToWorkspaceAssets()"
               [ngStyle]="{order: 99999}"
      >
        Files
      </sc-link>
    </ul>
  `,
  styles: [`
    sc-link.main {
        width: 100%;  
    }
    
    :host {
      background-color: ${Theme.colors.secondary};
      color: #374d85;
      padding: 0;
    }

    :host /deep/ sc-link, .sc-link {
      height: 4rem;
      border-bottom: 1px solid #dae6f3;
      display: flex;
    }
    
    :host /deep/ sc-link {
      justify-content: flex-start;
      align-items: center;
    }

    :host /deep/ sc-link:hover {
      background-color: #e3effc;
    }

    .link-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ul ul {
      padding-left: 0;
    }

    ul ul sc-link {
      padding-left: 25px;
    }

  `]
})
export class ScSidebarComponent {

  icons = FontawesomeIcons;

  @Input() menuItems: IMenuItem[];

  @Output() menuItemSelected = new EventEmitter<IMenuItem>();

  workspace$ = this.store.select(workpaceSelectors.workspace);

  @HostBinding('class')
  get hostClass() {
    return 'col-1 col-sm-3 flex';
  }

  constructor(private store: Store<AppState>) {

  }

  childrenFor$(parent: string) {
    return this.store.select(menuSelectors.byParent(parent));
  }

  onMenuItemSelected(menuItem: IMenuItem, queryParams: {[key:string]:string} = {}) {
    this.menuItemSelected.next({...menuItem, queryParams})
  }

  isActive(item: IMenuItem) {
    return item.selected === SelectionState.Selected || item.selected === SelectionState.Indeterminate;
  }

  navigateToWorkspaceAssets() {
    this.workspace$.first()
      .subscribe(ws => {
        this.store.dispatch(new NavigateToTestSuiteAssets(ws))
      })
  }
}
