import {Component, HostBinding, Input} from "@angular/core";

@Component({
  selector: 'sc-circle-indicator',
  template: `
    <div>
      <svg height="100%" width="100%" viewBox="0 0 100 100">
        <text
          class="text"
          fill="black"
          x="50"
          y="50"
          text-anchor="middle"
          alignment-baseline="middle"
        >{{value}}</text>
        <circle cx="50" cy="50" r="40"
                [attr.stroke]="color"
                [ngClass]="circleClass"
                fill="none"></circle>
      </svg>
      <div class="text-center">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .text {
      font-size: 2rem;
    }

    circle {
      stroke-width: 3px;
    }

  `]
})
export class ScCircleIndicatorComponent {

  @Input() color = 'silver';
  @Input() state: "success"|"danger"|"warning"|"info" = 'info';
  @Input() value = 0;

  ngOnInit() {
    this.color = 'black';
  }

  get circleClass() {
    return (this.state) ? `stroke-${this.state}` : '';
  }
}
