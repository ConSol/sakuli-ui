import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {ProjectService} from "../sweetest-components/services/access/project.service";
import {log, notNull} from "../core/redux.util";
import {Store} from "@ngrx/store";
import {AppState} from "./appstate.interface";
import {SetProject} from "./project/state/project.actions";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectOpenComponent} from "./project/project-open.component";

@Injectable()
export class SakuliProjectGuardService implements CanActivate {

  constructor(private projectService: ProjectService,
              private store: Store<AppState>,
              private modal: NgbModal,
              private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const project$ = this.projectService
      .activeProject();
    const hasActiveProject$ = project$.map(notNull);
    project$.filter(notNull).subscribe(p => {
      this.store.dispatch(new SetProject(p))
    })

    hasActiveProject$.filter(has => !has)
      .do(log('ActiveProject?XX')).subscribe(_ => {
      this.modal.open(ProjectOpenComponent).result.then(r => this.router.navigate(route.url));
    });
    hasActiveProject$.do(log('ActiveProject?'))
    return hasActiveProject$;
  }
}
