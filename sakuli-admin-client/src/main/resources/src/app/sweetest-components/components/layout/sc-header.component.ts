import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Theme} from "../theme";
import {IMenuItem} from "./menu/menu-item.interface";

@Component({
  selector: 'sc-header',
  template: `
    <button class="cursor-pointer navbar-toggler text-light"
            type="button"
            (click)="toggleNavVisible()"
    >
      <sc-icon icon="fa-bars"></sc-icon>
    </button>
    <div class="navbar-collapse d-sm-block" [ngClass]="{'d-none': !isNavVisibleOnSm}">
      <a class="navbar-brand" href="#">
        <img *ngIf="brandLogo" [src]="brandLogo"/>
        <span *ngIf="brandName">{{brandName}}</span>
      </a>
      <ul class="navbar-nav primary">
        <sc-link *ngFor="let menuItem of primaryMenuItems" [icon]="menuItem.icon" (click)="onLinkClick(menuItem)">
          {{menuItem.label}}
        </sc-link>
        <ng-content select="sc-link, sc-link.primary"></ng-content>
      </ul>
      <ul class="navbar-nav align-self-end secondary">
        <sc-link *ngFor="let menuItem of secondaryMenuItems" [icon]="menuItem.icon" (click)="onLinkClick(menuItem)">
          {{menuItem.label}}
        </sc-link>
        <ng-content select="sc-link.secondary"></ng-content>
      </ul>
    </div>
  `,
  styles: [`
    .navbar-nav.primary {
      flex-grow: 1;
    }
    
    :host {
      background-color: ${Theme.colors.primary};
      color: white !important;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75);
    }

    img {
      max-height: 30px;
    }
  `]
})
export class ScHeaderComponent {

  @HostBinding('class') get hostClass() {
    return 'navbar sticky-top navbar-expand-sm';
  }

  @Input() brandLogo: string;
  @Input() brandName: string;
  @Input() primaryMenuItems: IMenuItem[];
  @Input() secondaryMenuItems: IMenuItem[];

  @Output() menuItemSelected = new EventEmitter<IMenuItem>();
  isNavVisibleOnSm: boolean = false;

  onLinkClick(item: IMenuItem) {
    this.menuItemSelected.next(item);
  }

  toggleNavVisible() {
    this.isNavVisibleOnSm = !this.isNavVisibleOnSm;
  }
}
