import {Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {selectToastId} from "./toast-state.interface";
import {ScToastService} from "./toast.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {IToast} from "./toast.model";

@Component({
  animations: [
    trigger('toasts', [
      transition(':enter', [
        style({transform: 'scale(.5)', opacity: 0}),
        animate('.35s cubic-bezier(0.46,-0.24, 0.37, 1)',
          style({transform: 'scale(1)', opacity: 1}))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('.35s cubic-bezier(0.46,-0.24, 0.37, 1)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
          }))
      ])
    ])
  ],
  selector: 'sc-toast-container',
  template: `    
    <sc-toast
      *ngFor="let toast of toasts$ | async"
      [toast-type]="toast.type"
      [closeable]="true"
      (close)="closeToast(toast)"
    >
      <span class="toast-main-content d-flex flex-row justify-content-between">
        <span>
          <sc-icon *ngIf="toast.icon"  [icon]="toast.icon"></sc-icon>
          {{toast.message}}
        </span>
        <a (click)="toggleShowMore()" class="cursor-pointer" *ngIf="more">
          <sc-icon icon="fa-info-circle"></sc-icon>
        </a>
      </span>
      <div class="toast-info-content" *ngIf="isShowMore">
        <pre>{{toast.more | json}}</pre>
      </div>
      <ng-template #less></ng-template>
    </sc-toast>
  `,
  styles: [`
    :host {
      display: block;
      z-index: 800;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 1rem;
    }
    .toast-info-content {
      margin-top: 1.5rem;
    }
  `]
})
export class ScToastContainerComponent {
  toasts$: Observable<IToast[]>;

  isShowMore = false;
  constructor(
    private toastService: ScToastService
  ) {
    this.toasts$ = this.toastService.toasts$;
  }

  closeToast(toast: IToast) {
    this.toastService.remove(selectToastId(toast));
  }

  toggleShowMore() {
    this.isShowMore = !this.isShowMore;
  }
}
