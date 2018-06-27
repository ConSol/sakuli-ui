import {Component, OnInit} from '@angular/core';
import {AppState} from "../appstate.interface";
import {Store} from "@ngrx/store";
import {toastSelectors} from "../../sweetest-components/components/presentation/toast/toast-state.interface";
import {IToast} from "../../sweetest-components/components/presentation/toast/toast.model";

@Component({
  moduleId: module.id,
  selector: 'app-log',
  template: `
    <sc-content>
      <sc-heading
        icon="fa-commenting-o"
        title="Event Log"
      ></sc-heading>
      <article class="d-flex flex-column">
        <ul class="list-group">
          <ng-container
            *ngFor="let toast of logsHistory$ | async">
            <li
              class="list-group-item d-flex flex-row justify-content-between"
              [ngClass]="stateClass(toast)"
            >
              <span>
                <span class="text-muted">{{toast.timestamp | date:'medium'}}</span>
                <span>{{toast.message}}</span>
              </span>
              <a
                (click)="$event.preventDefault();toggleOpen(toast) "
                *ngIf="!!toast.more">More</a>
            </li>
            <li class="list-group-item" *ngIf="openMap.get(toast)">
              <ng-template #parsedMore>
                <pre>{{toast.more}}</pre>
              </ng-template>
              <pre *ngIf="isString(toast.more); else parsedMore">{{toast.more}}</pre>
            </li>
          </ng-container>
        </ul>
      </article>
    </sc-content>
  `
})
export class AppLogComponent {

  openMap = new WeakMap<IToast, boolean>();

  toggleOpen(toast: IToast) {
    this.openMap.set(toast, !this.openMap.get(toast))
  }

  constructor(readonly store: Store<AppState>) {
  }

  stateClass(toast: IToast) {
    return {[`list-group-item-${toast.type}`]: true};
  }

  get logsHistory$() {
    return this.store.select(toastSelectors.history);
  }

  isString(val: any): val is string {
    return typeof val === 'string';
  }
}
