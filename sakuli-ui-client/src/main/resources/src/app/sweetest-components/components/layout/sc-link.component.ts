import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";


@Component({
    selector: 'sc-link',
    template: `
      <li class="nav-item" [ngClass]="{active: active}">
        <a class="nav-link d-flex flex-row" (click)="onClick($event)">
          <sc-icon [icon]="icon"  [fixedWidth]="fixedIconWidth" class="d-flex w-100 flex-row justify-content-around" >
            <ng-content></ng-content>
          </sc-icon>
        </a>
      </li>
    `,
    styles: [`
      :host {
        outline: none;
      }
      
      a {
          cursor: pointer;
      }
      li {
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        flex: 1;
      }
      li a {
        align-self: center;
        flex-grow: 1;
      }
      li, li > * {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      :host /deep/ .actions {
        float: right;
      }
    `]
})
export class ScLinkComponent implements OnInit{
    @Input() icon: string;
    @Input() fixedIconWidth: boolean;
    @Input() href: string;
    @Input() active: boolean;
    @Input() class: string;

    @Output() click = new EventEmitter<ScLinkComponent>();

    ngOnInit() {
        this.fixedIconWidth = true;
    }

    onClick($event: MouseEvent) {
        $event.preventDefault();
        $event.stopPropagation();
        this.click.next(this);
    }
}
