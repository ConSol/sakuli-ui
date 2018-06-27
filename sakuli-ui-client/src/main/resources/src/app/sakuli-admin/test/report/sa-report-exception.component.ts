import {Input, Component, OnInit} from '@angular/core';
import {TestCaseException} from "../../../sweetest-components/services/access/model/test-result.interface";
import {rmHeadSlashAndEncode} from "../../../sweetest-components/services/access/file.service";

@Component({
  selector: 'sa-report-exception',
  template: `
    <ng-container *ngIf="exception">
      <li class="list-group-item d-flex flex-column">
        <strong>{{exception.detailMessage}}</strong>
        <thumbnail-component
          [src]="'api/files?path=' + testSuitePath + '/_logs/_json/' + rmHeadSlashAndEncode(exception.screenshot)"
          width="250px"
        ></thumbnail-component>
        <div>
          <button class="btn btn-link" (click)="showStacktrace = !showStacktrace">Show Stacktrace</button>
          <button class="btn btn-link"
                  *ngIf="showStacktrace"
                  (click)="toClipBoard(stackTraceArea)">Copy stack trace to clipboard
          </button>
        </div>
        <textarea #stackTraceArea
                  [disabled]="true"
                  rows="20"
                  [hidden]="!showStacktrace"
        >{{exception.stackTrace}}</textarea>
      </li>
    </ng-container>
  `
})

export class SaReportExceptionComponent {
  rmHeadSlashAndEncode = rmHeadSlashAndEncode;
  @Input() exception: TestCaseException | null;
  @Input() testSuitePath: string;

  showStacktrace = false;

  constructor() {
  }

  toClipBoard(textArea: HTMLTextAreaElement) {
    const pd = textArea.disabled;
    textArea.disabled = false;
    textArea.focus();
    textArea.setSelectionRange(0, textArea.value.length);
    const r = document.execCommand('copy');
    textArea.setSelectionRange(0, 0);
    textArea.disabled = pd;
  }
}
