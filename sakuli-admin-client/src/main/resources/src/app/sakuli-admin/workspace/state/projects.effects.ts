import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  AppendChildren, LOAD_PATH, LoadPath, OPEN_WORKSPACE, OpenWorkspace, TOGGLE_OPEN,
  ToggleOpen
} from './project.actions';
import {of} from 'rxjs/observable/of';
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {ErrorMessage} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {Observable} from "rxjs/Observable";
import {LoadTestsuite} from "../../test/state/testsuite.state";

@Injectable()
export class ProjectEffects {

  @Effect() open$ = this.actions$.ofType(LOAD_PATH)
    .mergeMap((loadPath: LoadPath) => {
      return this.fileService
        .files(loadPath.path)
        .map(fr => new AppendChildren(loadPath.path, fr))
        .catch(ErrorMessage(`Error while opening path '${loadPath.path}'`));
    });

  @Effect() afterToggle = this.actions$.ofType(TOGGLE_OPEN)
    .mergeMap((toggleOpen: ToggleOpen) => {
      return of(new LoadPath(absPath(toggleOpen.item)))
    })
    .catch(ErrorMessage(`Error while opening path`));


  @Effect() open = this.actions$.ofType(OPEN_WORKSPACE)
    .map((open: OpenWorkspace) => open.file)
    .expand((fr) => {
      if(fr.directory) {
        return this
          .fileService.files(absPath(fr))
          .mergeMap(f => Observable.from(f))
          .filter(fr => fr.directory || fr.name === 'testsuite.suite')
      } else {
        return Observable.empty();
      }
    })
    .filter(fr => fr.name === 'testsuite.suite')
    .map(fr => new LoadTestsuite(fr.path));

  constructor(
    private fileService: FileService,
    private actions$: Actions
  ) {}

}
