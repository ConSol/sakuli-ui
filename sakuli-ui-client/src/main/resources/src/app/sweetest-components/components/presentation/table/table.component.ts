import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'sc-table',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: table;
    }

    :host /deep/ th {
      background: #e3effc;
    }

    :host /deep/ td, :host /deep/ th {
      padding: .5em;
    }
  `]
})
export class ScTableComponent {

  @HostBinding('class')
  get hostCssClass() {
    return 'table table-responsive table-hover table-bordered table-stripped'
  }

}
