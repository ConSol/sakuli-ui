import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {ProjectService} from '../../../sweetest-components/services/access/project.service';
import {
  AppendChildren, LOAD_PATH, LoadPath, OPEN, Open, REFRESH_PROJECT, SetProject, TOGGLE_OPEN,
  ToggleOpen
} from './project.actions';
import {of} from 'rxjs/observable/of';
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {ErrorMessage} from "../../../sweetest-components/components/presentation/toast/toast-state.interface";
import {LoadTestsuite} from "../../test/state/testsuite.state";

@Injectable()
export class ProjectEffects {

  @Effect() refresh$ = this.actions$.ofType(REFRESH_PROJECT)
    .mergeMap(a => this.projectService.activeProject())
    .map(p => new SetProject(p))
    .catch(ErrorMessage('Error while fetching current project'));


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

  @Effect() open = this.actions$.ofType(OPEN)
    .map((open: Open) => new LoadTestsuite(
      open.file.directory ? absPath(open.file) : open.file.path));

  constructor(
    private projectService: ProjectService,
    private fileService: FileService,
    private actions$: Actions
  ) {}

}
