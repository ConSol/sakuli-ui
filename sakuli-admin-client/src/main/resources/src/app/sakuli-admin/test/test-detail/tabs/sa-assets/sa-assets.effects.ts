import {Injectable} from "@angular/core";
import {Actions, Effect, toPayload} from "@ngrx/effects";
import {ROUTER_NAVIGATION, RouterNavigationAction, RouterNavigationPayload} from "@ngrx/router-store";
import {FileService} from "../../../../../sweetest-components/services/access/file.service";
import {createSelector, Store} from "@ngrx/store";
import {
  AssetLoadFolder, AssetLoadFolderSuccess, ASSETS_DELETE, ASSETS_DELETE_SUCCESS, ASSETS_LOAD_FOLDER, ASSETS_OPEN_FILE,
  ASSETS_SET_CURRENT_FOLDER, ASSETS_UPLOAD, ASSETS_UPLOAD_SUCCESS, AssetsCloseFile, AssetsDelete, AssetsDeleteError,
  AssetsDeleteSuccess, AssetsOpenFile, AssetsSetCurrentFolder,
  AssetsUpload,
  AssetsUploadError, AssetsUploadSuccess
} from "./sa-assets.action";
import {AppState} from "../../../../appstate.interface";
import {project, projectFileRoot} from "../../../../project/state/project.interface";
import {log, notNull} from "../../../../../core/redux.util";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, NavigationEnd, Router, RouterState, RouterStateSnapshot} from "@angular/router";
import {absPath} from "../../../../../sweetest-components/services/access/model/file-response.interface";
import {ProjectModel} from "../../../../../sweetest-components/services/access/model/project.model";
import {
  currentChildren, currentChildrenBy, currentChildrenImages, currentFolderWithProjectPath,
  selectedFile
} from "./sa-assets.interface";
import {SaImageModal} from "./sa-image-modal.component";
import {ScModalService} from "../../../../../sweetest-components/components/presentation/modal/sc-modal.service";

import {RouterGo} from "../../../../../sweetest-components/services/router/router.actions";

@Injectable()
export class SaAssetsEffects {
  constructor(private action$: Actions,
              private fileService: FileService,
              private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private modal: ScModalService,) {
  }

  get deepestRoute() {
    let route = this.router.routerState.root.firstChild;
    while (route.firstChild) {
      route = route.firstChild
    }
    return route;
  }

  routeParamMap(pl: RouterNavigationPayload<RouterStateSnapshot>) {
    return this.router.events
      .filter(e => e instanceof NavigationEnd)
      .filter((e: NavigationEnd) => e.id === pl.event.id)
      .mergeMap(e => this.deepestRoute.paramMap)
  }

  @Effect() routeInit$ = this.action$.ofType(ROUTER_NAVIGATION)
    .map((a: RouterNavigationAction) => a.payload)
    .filter((pl: RouterNavigationPayload<RouterStateSnapshot>) => {
      const  {url} = pl.event;
      const regEx = /testsuite\/(.*)\/assets.*/
      return regEx.test(url);
    })
    .mergeMap((pl: RouterNavigationPayload<RouterStateSnapshot>) => {
      return Observable.combineLatest(
        this.routeParamMap(pl).map(m => m.has('suite') ? decodeURIComponent(m.get('suite')) : ''),
        this.routeParamMap(pl).map(m => m.has('file') ? decodeURIComponent(m.get('file')) : '')
      );
    })
    .map(([suite = '', file = '']) => {
      return [
        ...(suite || '').split('/'),
        ...(file || '').split('/')
      ].filter(p => p && p.length).join('/');
    })
    .filter(notNull)
    .mergeMap((p) => Observable.from([
      new AssetLoadFolder(p),
    ]));


  @Effect() loadAssets$ = this.action$.ofType(ASSETS_LOAD_FOLDER)
    .mergeMap((a: AssetLoadFolder) => this.fileService.files(a.folder).map(c => new AssetLoadFolderSuccess(a.folder, c)));

  @Effect() loadAssetsSuccess$ = this.action$.ofType(ASSETS_SET_CURRENT_FOLDER)
    .map((a: AssetsSetCurrentFolder) => {
      return new RouterGo({path: [
        '/testsuite',
        a.basePath,
        'assets',
        a.folder,
      ]})
    });


  @Effect() uploadFile = this.action$.ofType(ASSETS_UPLOAD)
    .combineLatest(this.store.select(project).filter(notNull).first())
    .mergeMap(([a, p]: [AssetsUpload, ProjectModel]) => {
      const {files, targetFolder} = a;
      return Observable.merge(...files.map(file => this.fileService
        .write(p.path + targetFolder, file)
        .map(s => new AssetsUploadSuccess(file))
        .catch((e: any) => Observable.of(new AssetsUploadError(file, e.message)))
      ))
    })

  @Effect() reload$ = this.action$
    .ofType(ASSETS_UPLOAD_SUCCESS, ASSETS_DELETE_SUCCESS)
    .combineLatest(this.store.select(currentFolderWithProjectPath))
    .map(([, cf]) => new AssetLoadFolder(cf));

  @Effect() delete$ = this.action$.ofType(ASSETS_DELETE)
    .combineLatest(this.store.select(project).filter(notNull).first())
    .mergeMap(([a, p]: [AssetsDelete, ProjectModel]) => {
      const {file} = a;
      return this.fileService.delete(p.path + absPath(file))
        .map(r => new AssetsDeleteSuccess(file))
        .catch(e => Observable.of(new AssetsDeleteError(file)))

    })

  @Effect({dispatch: false}) $openFile = this.action$
    .ofType(ASSETS_OPEN_FILE)
    .mergeMap((a: AssetsOpenFile) => Observable.combineLatest(
      Observable.of(`api/files?path=${a.base}`),
      this.store.select(createSelector(
        currentChildrenImages,
        children => children.map(c => absPath(c)))),
      this.store.select(selectedFile),
    ).first())
    .mergeMap(([basePath, images, selected]) => {
      const p = this.modal.open(SaImageModal, {
        basePath,
        images,
        selected
      });
      return Observable.fromPromise(p.catch(e => null));
    })
    .map(_ => new AssetsCloseFile())
}
