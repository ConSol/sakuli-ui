import {Component, Input, OnInit} from '@angular/core';
import {ScLoadingDisplayAs} from "./sc-loading-display-as.interface";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {isLoading, ScLoadingState} from "./sc-loading.state";
import {log} from "../../../../core/redux.util";
import 'rxjs';

@Component({
  selector: 'sc-loading-presentation',
  template: `    
    <ng-container [ngSwitch]="displayAs" *ngIf="show">
      <ng-container *ngSwitchCase="'spinner'">
        <sc-icon icon="fa-spinner" [spin]="true">
          <ng-content></ng-content>
        </sc-icon>
      </ng-container>
      <ng-container *ngSwitchCase="'progressbar'">
        <ngb-progressbar value="100" [striped]="true" [animated]="true">
          <ng-content></ng-content>
        </ngb-progressbar>
      </ng-container>
    </ng-container>
  `
})

export class ScLoadingPresentationComponent {

  @Input() displayAs: ScLoadingDisplayAs = "spinner";

  @Input() for: string;

  @Input() show: boolean;

}
