import {
  ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, OnInit,
  Output
} from '@angular/core';
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {resultStateMap} from "./result-state-map.const";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-report-navigation',
  template: `
    <div [class]="cardClass" *ngIf="testResult">
      <div [class]="'d-flex flex-row justify-content-between align-items-center ' + stateClass">
        <button class="btn btn-link cursor-pointer" (click)="prev()" *ngIf="navigation">
          <sc-icon icon="fa-chevron-left"></sc-icon>
        </button>
        <div style="flex-grow: 1" class="text-center">
          <sc-icon icon="fa-calendar">
            {{testResult.startDate | date:'dd-MM-y hh:mm:ss'}}
          </sc-icon> |
          <span><sc-icon icon="fa-clock-o">
            {{((testResult.stopDate|dateDiff:testResult.startDate) / 1000)|number}} sec
          </sc-icon></span> |
          {{testResult.id}} |
          {{testResult.state}}
        </div>
        <button class="btn btn-link cursor-pointer" (click)="next()" *ngIf="navigation">
          <sc-icon icon="fa-chevron-right"></sc-icon>
        </button>
      </div>

    </div>
  `
})

export class SaReportNavigationComponent {
  @Input() testResult: TestSuiteResult;
  @Input() navigation: boolean;

  @Output("next") _next = new EventEmitter();
  @Output("prev") _prev = new EventEmitter();

  @HostListener('document:keyup', ['$event'])
  handleKeyUp($event: KeyboardEvent) {
    if($event.which === 39) {
      this.next();
    }
    if($event.which === 37) {
      this.prev();
    }
  }

  get stateClass() {
    const {state = ''} = this.testResult;
    return `bg-${resultStateMap[state] || 'default'}`;
  }

  get cardClass() {
    return `card d-block`;
  }

 next() {
    this._next.next();
 }

 prev() {
    this._prev.next();
 }




}
