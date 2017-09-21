import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Theme} from "../theme";
import {MenuItem} from "./menu-item.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {log} from "../../../core/redux.util";

@Component({
  selector: 'sc-sidebar',
  template: `
    <ul class="nav flex-column">
      <ng-container *ngFor="let menuItem of menuItems">
        <sc-link [fixedIconWidth]="true"
                 [icon]="menuItem.icon"
                 (click)="onMenuItemSelected(menuItem)"
        >
          <span class="hidden-xs-down link-text">{{menuItem.label}}</span>
        </sc-link>
      <ul *ngIf="isActive([menuItem.link]) && menuItem.children.length">
        
        <sc-link *ngFor="let menuItem of menuItem.children"
          [fixedIconWidth]="true"
          [icon]="menuItem.icon"
          (click)="onMenuItemSelected(menuItem)"
        >
          <span class="hidden-xs-down link-text">{{menuItem.label}}</span>
        </sc-link>
      </ul>
      </ng-container>
    </ul>
  `,
  styles: [`
    :host {
      background-color: ${Theme.colors.secondary};
      color: #374d85;
      padding: 0;
    }

    :host /deep/ sc-link {
      height: 4rem;
      border-bottom: 1px solid #dae6f3;
      display: flex;
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

  @Input() menuItems: MenuItem[];

  @Output() menuItemSelected = new EventEmitter<MenuItem>();

  @HostBinding('class')
  get hostClass() {
    return 'col-1 col-sm-3 flex';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  onMenuItemSelected(menuItem: MenuItem) {
    this.menuItemSelected.next(menuItem)
  }

  isActive(url: string[]) {

    return this.router.isActive(url.join('/'), false);
  }
}
