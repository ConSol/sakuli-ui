import {Component, Input, OnInit} from '@angular/core';
import {ScLoadingDisplayAs} from "./sc-loading-display-as.interface";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {isLoading, ScLoadingState} from "./sc-loading.state";

@Component({
  selector: 'sc-loading',
  template: `    
    <ng-container [ngSwitch]="displayAs" *ngIf="show$ | async">
      <ng-container *ngSwitchCase="'spinner'">
        <sc-icon icon="fa-spinner" [spin]="true">
          <ng-content></ng-content>
        </sc-icon>
      </ng-container>
      
    </ng-container>
  `
})

export class ScLoadingComponent implements OnInit {

  @Input() displayAs: ScLoadingDisplayAs = "spinner";

  @Input() for: string;

  show$: Observable<boolean>;

  constructor(
    private store: Store<{scLoading: ScLoadingState}>
  ) {
  }

  ngOnInit() {
    this.show$ = this.store.select(isLoading(this.for));
  }

}
