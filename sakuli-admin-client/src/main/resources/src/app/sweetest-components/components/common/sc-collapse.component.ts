import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isBoolean} from "util";

@Component({
  moduleId: module.id,
  selector: 'sc-collapse',
  template: `
  <ng-container *ngIf="isShow">
    <ng-content></ng-content>
  </ng-container>
  `
})

export class ScCollapseComponent implements OnInit {

  @Output()
  change = new EventEmitter<boolean>();

  @Input('show')
  isShow = true;

  show() {
    if(!this.isShow) {
      this.isShow = true;
      this.next();
    }
  }

  hide() {
    if(this.isShow) {
      this.isShow = false;
      this.next();
    }
  }

  toggle() {
    this.isShow = !this.isShow;
    this.next();
  }

  private next() {
    this.change.next(this.isShow);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
