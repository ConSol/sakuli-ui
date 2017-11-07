import {Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Theme} from "../theme";
import {IMenuItem} from "./menu/menu-item.interface";

@Component({
  selector: 'sc-header',
  template: `
    <button class="navbar-toggler"
            type="button"
            >
      <sc-icon icon="fa-bars"></sc-icon>
    </button>
    <div class="navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="#">
        <img *ngIf="brandLogo" [src]="brandLogo"/>
        <span *ngIf="brandName">{{brandName}}</span>
      </a>
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <sc-link *ngFor="let menuItem of primaryMenuItems" [icon]="menuItem.icon" (click)="onLinkClick(menuItem)">
          {{menuItem.label}}
        </sc-link>
        <ng-content select="sc-link, sc-link.primary"></ng-content>
      </ul>
      <ul class="navbar-nav align-self-end">
        <sc-link *ngFor="let menuItem of secondaryMenuItems" [icon]="menuItem.icon" (click)="onLinkClick(menuItem)">
          {{menuItem.label}}
        </sc-link>
        <ng-content select="sc-link.secondary"></ng-content>
      </ul>
    </div>
  `,
  styles: [`
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

  onLinkClick(item: IMenuItem) {
    this.menuItemSelected.next(item);
  }
}
