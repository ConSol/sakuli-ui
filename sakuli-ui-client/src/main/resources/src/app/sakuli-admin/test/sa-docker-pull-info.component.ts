import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DockerPullInfo} from "./state/test.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'docker-pull-info-component',
  template: `
    <ng-template #layerMessage>
      <span>Layer {{dockerPullInfo.id}}: {{dockerPullInfo.status}}</span>
      <ngb-progressbar
        [value]="loaded"
        [type]="displayType"
        [animated]="true"
      >
      </ngb-progressbar>
    </ng-template>
    <span *ngIf="dockerPullInfo.status.startsWith('Pulling from'); else layerMessage">{{dockerPullInfo.status}}</span>
  `
})

export class SaDockerPullInfoComponent {

  @Input() dockerPullInfo: DockerPullInfo;

  get displayType() {
    return this.isCompleted ? "success" : "info";
  }

  get isCompleted() {
    if(this.hasProgressDetail) {
      const {total, current} = this.dockerPullInfo.progressDetail;
      return current / total === 1
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
      return ((current / total) * 100).toPrecision(1);
    }
  }


}
