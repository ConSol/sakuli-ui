import {Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {KeyValuePairListString, KeyValueStringPair} from "./key-value-list.interface";

@Component({
  selector: 'key-value-list',
  template: `
    <div class="pair mb-1 input-group" *ngFor="let pair of _value">
      <input 
        class="form-control form-control-sm" 
        type="text" 
        placeholder="Key"
        [(ngModel)]="pair.key"
        [ngModelOptions]="{standalone: true}"
      >
      <div class="input-group-prepend input-group-append">
        <span class="input-group-text">=</span>
      </div>
      <input 
        class="form-control form-control-sm" 
        type="text" 
        placeholder="Value"
        [(ngModel)]="pair.value"
        [ngModelOptions]="{standalone: true}"
      >
      <div class="input-group-append">
        <span class="input-group-text">
          <sc-icon icon="fa-trash" (click)="remove(pair)"></sc-icon>
        </span>
      </div>
    </div>
    <button class="btn btn-success btn-sm" (click)="addEmptyEntry()">
      <sc-icon icon="fa-plus"></sc-icon>
    </button>
  `,
  styles: [`
    .pair {
      /*
      display: flex;
      flex-direction: row;
      */
    }
    
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyValueListComponent),
      multi: true
    }
  ]
})
export class KeyValueListComponent implements ControlValueAccessor {

  @Output() change = new EventEmitter<KeyValuePairListString>();

  _value:KeyValuePairListString = [];

  // Function to call when the rating changes.
  onChange = (items: KeyValuePairListString) => {};

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {};

  writeValue(obj: KeyValuePairListString = []): void {
    this._value = obj;
    this.onChange(obj);
    this.change.next(obj);
  }

  remove(item: KeyValueStringPair) {
    this.writeValue(
      this._value.filter(i => i !== item)
    )
  }

  addEmptyEntry() {
    this.writeValue([...this._value, {key:'', value: ''}]);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor() {
  }

  ngOnInit() {
  }
}
