import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  AppendChildren,
  LOAD_PATH,
  LoadPath,
  OPEN_WORKSPACE,
  OPEN_WORKSPACE_DIALOG,
  OpenWorkspace,
  TOGGLE_OPEN,
  ToggleOpen
} from './project.actions';
import {of} from 'rxjs/observable/of';
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {ErrorMessage, WarnMessage} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {Observable} from "rxjs/Observable";
import {LoadTestsuite} from "../../test/state/testsuite.state";
import {Filters} from "../../../sweetest-components/components/presentation/file-selector/file-selector-filter.interface";
import {ScFileSelectorService} from "../../../sweetest-components/components/presentation/file-selector/sc-file-selector.service";
import {log} from "../../../core/redux.util";
import {NavigateToDashboard} from "../../dashboard/dashboard.state";

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

  @Effect() openDialog$ = this.actions$.ofType(OPEN_WORKSPACE_DIALOG)
    .mergeMap(_ => {
      return Observable.fromPromise(this.fileSelector.openModal({
        title: 'Select a workspace',
        root: '',
        inactive: Filters.isFile()
      }))
        .map(f => f[0])
        .mergeMap(f => [
          new OpenWorkspace(f),
          new NavigateToDashboard()
        ])
        .catch(WarnMessage('No file selected'))
    })
  ;

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
    private actions$: Actions,
    readonly fileSelector: ScFileSelectorService
  ) {}

}
