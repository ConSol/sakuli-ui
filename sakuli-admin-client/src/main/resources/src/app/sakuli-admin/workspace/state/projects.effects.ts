import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {ProjectService} from '../../../sweetest-components/services/access/project.service';
import {
  AppendChildren, LOAD_PATH, LoadPath, OPEN_WORKSPACE, OpenWorkspace, REFRESH_PROJECT, SetProject, TOGGLE_OPEN,
  ToggleOpen
} from './project.actions';
import {of} from 'rxjs/observable/of';
import {absPath} from "../../../sweetest-components/services/access/model/file-response.interface";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {ErrorMessage} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {Observable} from "rxjs/Observable";
import {LoadTestsuite} from "../../test/state/testsuite.state";
import {AddMenuItem} from "../../../sweetest-components/components/layout/menu/menu.state";
import {MenuItem} from "../../../sweetest-components/components/layout/menu/menu-item.interface";
import {LayoutMenuService} from "../../../sweetest-components/components/layout/menu/layout-menu.service";
import {FontawesomeIcons} from "../../../sweetest-components/components/presentation/icon/fontawesome-icon.utils";
import {SelectionState} from "../../../sweetest-components/model/tree";

@Injectable()
export class ProjectEffects {

  @Effect() refresh$ = this.actions$.ofType(REFRESH_PROJECT)
    .mergeMap(a => this.projectService.activeProject())
    .map(p => new SetProject(p))
    .catch(ErrorMessage('Error while fetching current testSuite'));


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
    private projectService: ProjectService,
    private fileService: FileService,
    private actions$: Actions
  ) {}

}
