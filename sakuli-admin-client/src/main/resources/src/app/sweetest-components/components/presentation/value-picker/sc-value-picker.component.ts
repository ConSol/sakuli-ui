import {Component, forwardRef, Input} from "@angular/core";
import {ScModalService} from "../modal/sc-modal.service";
import {ScValuePickerModalComponent} from "./sc-value-picker-modal.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'sc-value-picker',
  template: `
    <ng-template #notargetFolder>
      <ng-content></ng-content>
    </ng-template>
    <div (click)="selectFolder()" class="text-overflow-ellipsis">
      <span *ngIf="value; else notargetFolder">
        <sc-icon [icon]="pickIcon(innerValue)">{{pickValueText(innerValue)}}</sc-icon>
      </span>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScFolderPickerComponent),
      multi: true
    }
  ]
})
export class ScFolderPickerComponent<T> implements ControlValueAccessor {

  @Input() values: string[];

  @Input() headerText:string;
  @Input() cancelText: string;

  @Input() pickIcon: (item: T) => string = i => null;
  @Input() pickValueText: (item: T) => string = i => i.toString();

  constructor(
    private modalService: ScModalService
  ) {}

  selectFolder() {
    this.modalService
      .open(ScValuePickerModalComponent, {
        values: this.values,
        headerText: this.headerText,
        cancelText: this.cancelText,
        pickValueText: this.pickValueText,
        pickIcon: this.pickIcon
      }).then(v => {
        console.log('Hello', v);
        this.value = v
    })
  }

  private innerValue: T;
  private changed = new Array<(value: T) => void>();
  private touched = new Array<() => void>();


  get value(): T {
    return this.innerValue;
  }

  set value(value: T) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.changed.forEach(f => f(value));
    }
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value: T) {
    this.innerValue = value;
  }

  registerOnChange(fn: (value: T) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

}
