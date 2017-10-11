import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from "@angular/core";
import {FontawesomeIcon} from './fontawesome-icon.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-icon',
  template: `
    <i [class]="'fa ' + iconClass" [ngClass]="ngClass" [ngStyle]="{transform:iconTransform}"></i>
    <ng-content></ng-content>
  `,
  styles: [`
    .fa {
      margin-right: 3px;
      transition: all .25s ease-out;
    }`]
})
export class ScIconComponent implements OnInit {

  @HostBinding('class')
  get hostClass() {
    return 'flex-row';
  }

  @Input() icon?: FontawesomeIcon;
  @Input() fixedWidth?: boolean;
  @Input() listItem?: boolean;
  @Input() border?: boolean;
  @Input() pullRight?: boolean;
  @Input() pullLeft?: boolean;
  @Input() spin?: boolean;
  @Input() rotate?: number = 0;
  @Input() size: number;
  @Input() lg: boolean;
  @Input() iconClass: string = '';

  ngOnInit() {
  }

  get iconTransform() {
    return `rotate(${this.rotate}deg)`
  }

  get ngClass() {
    return ({
      'fa-fw': this.fixedWidth || this.icon == null,
      'fa-border': this.border,
      'fa-pull-left': this.pullLeft,
      'fa-pull-right': this.pullRight,
      'fa-spin': this.spin,
      'fa-li': this.listItem,
      'fa-2x': this.size === 2,
      'fa-3x': this.size === 3,
      'fa-4x': this.size === 4,
      'fa-5x': this.size === 5,
      'fa-lg': this.lg,
      [this.icon]: this.icon != null
    });
  }
}
