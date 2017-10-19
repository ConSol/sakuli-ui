import {Component} from "@angular/core";

@Component({
  selector: 'sc-content',
  template: `
    <div class="container">
      <ng-content select="sc-heading, header"></ng-content>
      <ng-content select="article"></ng-content>
      <ng-content select="footer"></ng-content>
    </div>
  `,
  styles: [`
    /* @TODO: create own stylesheet to avoid :host /deep/ selectors */ 
    
    :host {
      width: 100%;
      overflow: hidden;
      display: block;
    }

    .container {
      width: 100%;
      height: calc(100vh - 62px);
      display: flex;
      flex: 1 1 0;
      flex-direction: column;
      padding: 0;
    }

    :host /deep/ sc-heading, :host /deep/ header {
      padding: 20px 20px 0 20px;
    }

    :host /deep/ article {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
    }

    :host /deep/ footer {
      padding: 20px;
    }
  `]
})
export class ScContentComponent {

}
