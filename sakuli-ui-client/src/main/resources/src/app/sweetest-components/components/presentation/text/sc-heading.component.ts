import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FontawesomeIcon} from '../icon/fontawesome-icon.utils';

@Component({
  selector: 'sc-hx',
  styles: [`
    :host {
      display: block;
      margin-bottom: 10px;
    }
  `],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-container [ngSwitch]="order">
      <h1 *ngSwitchCase="1">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h1>
      <h2 *ngSwitchCase="2">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h2>
      <h3 *ngSwitchCase="3">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h3>
      <h4 *ngSwitchCase="4">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h4>
      <h5 *ngSwitchCase="5">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h5>
      <h6 *ngSwitchCase="6">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h6>
      <h1 *ngSwitchDefault>
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h1>
    </ng-container>
    <!--<h1 #outlet><ng-content></ng-content></h1>-->
  `
})
export class ScHxComponent {
  @Input() order;
  @ViewChild('content') content: ElementRef;
  @ViewChild('outlet') outlet: ElementRef;
}

@Component({
  selector: 'sc-heading',
  template: `
    <sc-hx [order]="2">
      <span>
        <sc-icon *ngIf="icon" [icon]="icon"></sc-icon>
        {{title}}
        <small class="text-muted">{{subTitle}}</small>
      </span>
      <div class="pull-right">
        <ng-content></ng-content>
      </div>
    </sc-hx>
    
  `,
  styles: [`
    :host, sc-hx {
      width: 100%;
    }

    sc-hx {
      border-bottom: 1px solid silver;
    }
  `]
})
export class ScHeadingComponent {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() icon?: FontawesomeIcon;
}
