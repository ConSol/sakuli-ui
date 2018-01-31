import {absPath, FileResponse} from '../../../services/access/model/file-response.interface';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Tree} from './tree.interface';

@Component({
  selector: 'sc-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('show', [
      transition(':enter', [
        style({height: '0'}),
        animate('350ms ease-in')
      ]),
      transition(':leave', [
        animate('350ms ease-in', style({height: '0'}))
      ])
    ])
  ],
  template: `
    <ul>
      <ng-container *ngFor="let file of files">
        <sc-tree-item [file]="file"
                      (click)="onOpen(file, $event)"
                      [ident]="depth"
                      [selected]="isSelected(file)"
        >
        </sc-tree-item>
        <sc-tree
          [files]="file.children"
          (open)="onOpen($event)"
          [depth]="depth + 1"
          *ngIf="file.open"
          [@show]
          [selected]="selected"
        >
        </sc-tree>
      </ng-container>
    </ul>
  `,
  styles: [`
    ul {
      padding-left: 0;
    }
  `]
})
export class ScTreeComponent {
  @Input() files: Tree<FileResponse>[];
  @Input() selected: Tree<FileResponse>;
  @Input() depth = 0;
  @Output() open = new EventEmitter<Tree<FileResponse>>();

  onOpen(e: Tree<FileResponse>, $event: MouseEvent) {
    if ($event && $event.stopPropagation) {
      $event.stopPropagation();
      if (e.directory) {
        e.open = !e.open;
      }
    }
    this.open.next(e);
  }

  isSelected(file: Tree<FileResponse>) {
    if(this.selected) {
      return absPath(file) === absPath(this.selected);
    } else {
      return false;
    }
  }
}
