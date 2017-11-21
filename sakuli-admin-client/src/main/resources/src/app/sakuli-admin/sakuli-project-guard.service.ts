import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {ProjectOpenComponent} from "./workspace/project-open.component";
import {testSuiteSelectors} from "./test/state/testsuite.state";
import {ScModalService} from "../sweetest-components/components/presentation/modal/sc-modal.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SakuliProjectGuardService implements CanActivate {

  constructor(
              private store: Store<AppState>,
              private modal: ScModalService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.store.select(testSuiteSelectors.selectTotal)
      .mergeMap(total => {
        if (total > 0) {
          return Observable.of(true);
        } else {
          const projectModal = this.modal.open(ProjectOpenComponent, {});
          return Observable.fromPromise(projectModal);
        }
      });
  }
}
