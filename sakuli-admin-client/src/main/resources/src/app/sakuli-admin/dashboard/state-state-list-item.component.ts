import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'state-state-list-item-component',
  template: `
    <div class="stacked" [ngClass]="valueStateClass" [ngStyle]="{'width': value}"></div>
    <div class="stacked pl-1">
      <ng-content></ng-content> 
    </div>
  `,
  styles: [`
    .stacked {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
    }
  `]
})
export class StateStateListItemComponent {

  @Input() state: "danger" | "success" | "warning" | "info" = "info";
  @Input() value: number;

  @HostBinding('class')
  get hostClass() {
    return 'list-group-item p-relative'
  }

  get valueStateClass() {
    return `bg-${this.state}`;
  }

}
