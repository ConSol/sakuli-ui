import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'sc-folder-picker-modal',
  template: `
    <ul class="list-group">
      <li class="list-group-item"
        *ngIf="headerText"
      ><strong>{{headerText}}</strong></li>
      <li class="cursor-pointer list-group-item list-group-item-action"
          [ngClass]="{'text-success': value === selected}"
          *ngFor="let value of values"
          (click)="close(value)">
        <sc-icon [icon]="pickIcon(value)">{{pickValueText(value)}}</sc-icon>
      </li>
      <li class="list-group-item justify-content-end"
        *ngIf="cancelText"
      >
        <button class="btn btn-warning pull-right" (click)="dismiss()">{{cancelText}}</button>
      </li>
    </ul>
  `
})
export class ScValuePickerModalComponent<T> implements OnInit{

  @Input() values: T[];

  @Input() headerText:string;
  @Input() cancelText: string;

  @Input() pickIcon: (item: T) => string = i => null;
  @Input() pickValueText: (item: T) => string = i => i.toString();

  constructor(private modal: NgbActiveModal) {

  }

  ngOnInit() {
  }

  dismiss() {
    this.modal.dismiss();
  }

  close(value: string) {
    this.modal.close(value);
  }

}
