import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {TestActionResult} from "../../../sweetest-components/services/access/model/test-result.interface";

@Component({
  moduleId: module.id,
  selector: 'sa-action',
  template: `
    <div style="flex-grow: 1" class="pl-4">
      <div class="action">
        <span class="object">{{action.object}}</span>.<span class="method">{{action.method}}</span>(<span
        class="args">
        <ng-container *ngIf="showArgs; else hideArgs">
          <div *ngFor="let arg of action.args || []" class="pl-3">
            {{arg | json}}
          </div>
          <div>
          <sc-icon icon="fa-minus-square-o" (click)="showArgs = false"></sc-icon>
          </div>
        </ng-container>
        <ng-template #hideArgs>
          <span class="badge badge-info" 
                *ngIf="action.args"
                (click)="showArgs = true"
          >{{action.args.length}} arguments</span>
        </ng-template>
      </span>)
      </div>
      <span class="text-muted font-italic">{{action.message}}</span>
    </div>
    <a *ngIf="action.documentationURL" [href]="action.documentationURL" target="_blank">
      <sc-icon icon="fa-question"></sc-icon>
    </a>
  `,
  styles: [`
    .action {
      font-family: medium Consolas, "Andale Mono", Monaco, "Liberation Mono", "Bitstream Vera Sans Mono", "DejaVu Sans Mono", monospace;
    }

    .method {
      color: blue;
    }
  `]
})

export class SaActionComponent implements OnInit {

  @Input() action: TestActionResult;

  showArgs = false;

  @HostBinding('class')
  get hostClass() {
    return "list-group-item d-flex flex-row align-items-center";
  }

  constructor() {
  }

  ngOnInit() {
  }

  args(args: string[] | null) {
    return (args || []).join(', ')
  }
}
