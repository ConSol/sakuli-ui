import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {ProjectService} from '../../../sweetest-components/services/access/project.service';
import {
  AppendChildren, LOAD_PATH, LoadPath, OPEN, Open, REFRESH_PROJECT, SetProject, TOGGLE_OPEN,
  ToggleOpen
} from './project.actions';
import {of} from 'rxjs/observable/of';
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../appstate.interface";
import {project} from "./project.interface";
import {notNull} from "../../../core/redux.util";

@Injectable()
export class ProjectEffects {

  @Effect() refresh$ = this.actions$.ofType(REFRESH_PROJECT)
    .mergeMap(a => this.projectService.activeProject())
    .map(p => new SetProject(p))

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
    private store: Store<AppState>,
    private actions$: Actions
  ) {}

}
