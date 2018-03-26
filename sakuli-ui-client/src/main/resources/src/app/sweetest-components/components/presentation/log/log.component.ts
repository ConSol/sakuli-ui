import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {LogMessage} from "../../../../sakuli-admin/test/state/test.interface";
import {AnsiColorPipe} from "./ansi-color.pipe";


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sc-logs',
  template: `    
    <div class="pre" #pre>
      <div class="line"
           *ngFor="let message of messages; let i = index"
           [innerHTML]="message | ansiColors | safeHtml"
      >
      </div>
    </div>
  `,
  styles: [`
    :host {
      background: rgb(30, 30, 30);
      display: flex;
    }

    pre, .pre {
      color: rgb(200, 200, 200);
      margin: 1rem;
      font-family: medium Consolas, "Andale Mono", Monaco, "Liberation Mono", "Bitstream Vera Sans Mono", "DejaVu Sans Mono", monospace;
    }

    .line:before {
      color: yellow;
    }
    
    .line {
      background: rgb(30, 30, 30);
      white-space: pre;
    }
  `,
  AnsiColorPipe.Styles
  ]
})
export class ScLogComponent  {

  @Input() follow: boolean = true;

  @Input() messages: LogMessage[];
}
