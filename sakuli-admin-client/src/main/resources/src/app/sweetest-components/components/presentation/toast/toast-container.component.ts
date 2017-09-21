import {Component, Input} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Toast, ToastState} from "./toast-state.interface";
import {ScToastService} from "./toast.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  animations: [
    trigger('toasts', [
      transition(':enter', [
        style({transform: 'scale(.5)', opacity: 0}),
        animate('.35s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('.35s cubic-bezier(.8, -0.6, 0.2, 1.5)',
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
      @toasts
      *ngFor="let toast of toasts$ | async;let i = index"
      [toast-type]="toast.type"
      [closeable]="true"
      (close)="closeToast(i)"
    >
      {{toast.message}}
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
  `]
})
export class ScToastContainerComponent {
  toasts$: Observable<Toast[]>;
  constructor(
    private toastService: ScToastService
  ) {
    this.toasts$ = this.toastService.toasts$;
  }

  closeToast(i) {
    this.toastService.remove(i);
  }
}
