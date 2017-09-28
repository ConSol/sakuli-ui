import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DockerPullInfo} from "./state/test.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'docker-pull-info-component',
  template: `
    Layer {{dockerPullInfo.id}}: {{dockerPullInfo.status}}
    <ngb-progressbar 
                     [value]="loaded"
                     [type]="displayType"
    >
    </ngb-progressbar>
  `
})

export class SaDockerPullInfoComponent {

  @Input() dockerPullInfo: DockerPullInfo;

  get displayType() {
    return this.hasProgressDetail ?  "info":  this.isCompleted ? "success" : "warning";
  }

  get isCompleted() {
    if(this.hasProgressDetail) {
      const {total, current} = this.dockerPullInfo.progressDetail;
      return total / current === 1
    } else {
      return false;
    }
  }

  get hasProgressDetail() {
    return !!this.dockerPullInfo.progressDetail;
  }

  get loaded() {
    if (!this.hasProgressDetail) {
      return 100;
    } else {
      const {total, current} = this.dockerPullInfo.progressDetail;
      return (current / total) * 100;
    }
  }


}
