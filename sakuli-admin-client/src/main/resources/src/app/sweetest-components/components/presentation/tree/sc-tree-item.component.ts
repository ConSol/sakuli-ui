import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {FontawesomeIcon} from '../icon/fontawesome-icon.utils';
import {FileResponse} from '../../../services/access/model/file-response.interface';
import {Tree} from './tree.interface';
@Component({
  selector: 'sc-tree-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #busy>
      <sc-icon icon="fa-spinner" [spin]="true"></sc-icon>
    </ng-template>
    <sc-icon icon="fa-chevron-right" [fixedWidth]="true" [rotate]="rotate" *ngIf="file.directory"></sc-icon>
    <sc-icon icon="" [fixedWidth]="true" [rotate]="rotate" *ngIf="!file.directory"></sc-icon>
    <sc-icon [icon]="icon" *ngIf="!file.busy; else busy">
      <span class="item-text" [ngClass]="{'active': selected}">{{file.name}}</span>
      <ng-content></ng-content>
    </sc-icon>
  `,
  styles: [`
    :host {
        cursor: pointer;
        display:block;
        width: 100%;
    }
    .item-text:hover {
      text-decoration: underline;
    }
    .item-text.active {
      font-weight: bold;
    }
  `]
})
export class ScTreeItemComponent implements OnInit {
  @Input() file: Tree<FileResponse>;
  @Input() ident: number;
  @Input() selected: boolean;
  icon: FontawesomeIcon;

  padding = 20;

  @HostBinding('class')
  get hostClass() {
    return ''
  }

  @HostBinding('style.paddingLeft')
  get hostStylePaddingLeft() {
    return `${this.padding + (this.ident * this.padding)}px`
  }

  get rotate() {
    return this.file.open ? 90 : 0;
  }

  ngOnInit() {
    this.icon = this.file.directory ? 'fa-folder-o' : 'fa-file-o';
  }
}
