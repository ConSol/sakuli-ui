import {Component, Input} from '@angular/core';
import {ScLoadingDisplayAs} from "./sc-loading-display-as.interface";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {isLoading, ScLoadingState} from "./sc-loading.state";
import 'rxjs';

@Component({
  selector: 'sc-loading',
  template: `    
    <sc-loading-presentation
      [displayAs]="displayAs"
      [show]="show$ | async"
    ></sc-loading-presentation>
  `
})

export class ScLoadingComponent {

  @Input() displayAs: ScLoadingDisplayAs = "spinner";

  @Input() for: string;

  get show$(): Observable<boolean> {
    return this.store.select(isLoading(this.for));
  }

  constructor(
    private store: Store<{scLoading: ScLoadingState}>
  ) {
  }

}
