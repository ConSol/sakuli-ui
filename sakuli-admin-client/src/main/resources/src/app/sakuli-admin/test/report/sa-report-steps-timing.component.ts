import {ChangeDetectionStrategy, Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sa-report-steps-timing',
  template: `
    <div class="indicator" 
         [ngStyle]="{backgroundColor:color}"
    ></div>
  `,
  styles: [`
    :host {
      height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    
    .indicator {
      height: 20px;
      transition: height .35s ease-out;
    }

    :host:hover .indicator, .indicator:hover {
      height: 30px;
    }
  `]
})

export class SaReportStepsTimingComponent {

  @Input() color: string;

  /**
   * Timing relativ to overall duration of the test
   */
  @Input() timing: number;

  constructor() {}

  @HostBinding('style.flex-grow') get hostStyleFlexGrow() { return this.timing}

}
