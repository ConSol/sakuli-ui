import {Component, Input} from "@angular/core";
@Component({
    selector: 'sc-counter',
    template: `
      {{count}}
    `
})
export class ScCounterComponent {

    @Input() count = 0;

}
