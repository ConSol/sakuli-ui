import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'sc-modal-component',
  template: `
    <ng-content></ng-content>
  `
})
export class ScModalComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
