import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {ProjectService} from '../../../sweetest-components/services/access/project.service';
import {AppendChildren, LOAD_PATH, LoadPath, OPEN, Open, SetProject, TOGGLE_OPEN, ToggleOpen} from './project.actions';
import {of} from 'rxjs/observable/of';
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";

@Injectable()
export class ProjectEffects {

  @Effect() open$ = this.actions$.ofType(LOAD_PATH)
    .mergeMap((loadPath: LoadPath) => {
      return this.fileService
        .files(loadPath.path)
        .map(fr => new AppendChildren(loadPath.path, fr))
    });

  @Effect() afterToggle = this.actions$.ofType(TOGGLE_OPEN)
    .mergeMap((toggleOpen: ToggleOpen) => {
      return of(new LoadPath(absPath(toggleOpen.item)))
    });

  @Effect() open = this.actions$.ofType(OPEN)
    .mergeMap((open: Open) => {
      return this.projectService
        .open(open.file.path)
        .map(p => new SetProject(p));
    });

  constructor(
    private projectService: ProjectService,
    private fileService: FileService,
    private actions$: Actions
  ) {}

}
