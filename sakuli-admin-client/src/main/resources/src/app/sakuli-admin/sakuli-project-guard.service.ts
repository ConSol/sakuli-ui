import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {testSuiteSelectors} from "./test/state/testsuite.state";
import {Observable} from "rxjs/Observable";
import {ScFileSelectorService} from "../sweetest-components/components/presentation/file-selector/sc-file-selector.service";
import {OpenWorkspace} from "./workspace/state/project.actions";

@Injectable()
export class SakuliProjectGuardService implements CanActivate {

  constructor(
              private store: Store<AppState>,
              readonly fileSelector: ScFileSelectorService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.store.select(testSuiteSelectors.selectTotal)
      .mergeMap(total => {
        if (total > 0) {
          return Observable.of(true);
        } else {
          return Observable.fromPromise(
            this.fileSelector.openModal({root: ''})
              .then(([file] = []) => {
                if(file) {
                  this.store.dispatch(new OpenWorkspace(file));
                }
                return true;
              })
          );
        }
      });
  }
}
