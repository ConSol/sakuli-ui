import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {ROUTER_NAVIGATION, RouterNavigationAction, RouterNavigationPayload} from "@ngrx/router-store";
import {createSelector, Store} from "@ngrx/store";
import {
  AssetLoadFolder, AssetLoadFolderSuccess, ASSETS_DELETE, ASSETS_DELETE_SUCCESS, ASSETS_LOAD_FOLDER, ASSETS_OPEN_FILE,
  ASSETS_SET_CURRENT_FOLDER, ASSETS_UPLOAD, ASSETS_UPLOAD_SUCCESS, AssetsCloseFile, AssetsDelete, AssetsDeleteError,
  AssetsDeleteSuccess, AssetsOpenFile, AssetsSetCurrentFolder, AssetsUpload, AssetsUploadError, AssetsUploadSuccess
} from "./sa-assets.action";
import {Observable} from "rxjs/Observable";
import {NavigationEnd, Router, RouterStateSnapshot} from "@angular/router";
import {
  currentChildrenImages, currentFolderWithProjectPath,
  selectedFile
} from "./sa-assets.interface";
import {SaImageModalComponent} from "./sa-image-modal.component";
import {FileService} from "../../../sweetest-components/services/access/file.service";
import {AppState} from "../../appstate.interface";
import {ScModalService} from "../../../sweetest-components/components/presentation/modal/sc-modal.service";
import {log, notNull} from "../../../core/redux.util";
import {
  absPath, FileResponse,
  fileResponseFromPath
} from "../../../sweetest-components/services/access/model/file-response.interface";
import {AssetItemType, getItemType} from "./asset-item-type.enum";
import {SaTextModalComponent} from "./sa-text-modal.component";
import {workpaceSelectors} from "../../workspace/state/project.interface";

@Injectable()
export class SaAssetsEffects {
  constructor(private action$: Actions,
              private fileService: FileService,
              private store: Store<AppState>,
              private router: Router,
              private modal: ScModalService,) {
  }

  @Effect() setCurrentFolder$ = this.action$.ofType(ASSETS_SET_CURRENT_FOLDER)
    .map((a: AssetsSetCurrentFolder) => new AssetLoadFolder(a.fullPath));

  @Effect() loadAssets$ = this.action$.ofType(ASSETS_LOAD_FOLDER)
    .mergeMap((a: AssetLoadFolder) => this.fileService.files(a.folder).map(c => new AssetLoadFolderSuccess(a.folder, c)));

  @Effect() uploadFile = this.action$.ofType(ASSETS_UPLOAD)
    .combineLatest(this.store.select(workpaceSelectors.workspace).filter(notNull).first())
    .mergeMap(([a, p]: [AssetsUpload, string]) => {
      const {files, targetFolder} = a;
      return Observable.merge(...files.map(file => this.fileService
        .write(p + targetFolder, file)
        .map(s => new AssetsUploadSuccess(file))
        .catch((e: any) => Observable.of(new AssetsUploadError(file, e.message)))
      ))
    })

  @Effect() reload$ = this.action$
    .ofType(ASSETS_UPLOAD_SUCCESS, ASSETS_DELETE_SUCCESS)
    .combineLatest(this.store.select(currentFolderWithProjectPath))
    .map(([, cf]) => new AssetLoadFolder(cf));

  @Effect() delete$ = this.action$.ofType(ASSETS_DELETE)
    .combineLatest(this.store.select(workpaceSelectors.workspace).filter(notNull).first())
    .mergeMap(([a, p]: [AssetsDelete, string]) => {
      const {file} = a;
      return this.fileService.delete(p + absPath(file))
        .map(r => new AssetsDeleteSuccess(file))
        .catch(e => Observable.of(new AssetsDeleteError(file)))

    })

  @Effect() $openFile = this.action$
    .ofType(ASSETS_OPEN_FILE)
    .map((a: AssetsOpenFile): [AssetsOpenFile, FileResponse] => ([a, fileResponseFromPath(a.file, true)]))
    .groupBy(([a, fr]) => getItemType(fr))
    .mergeMap((ga) => {
      console.log(ga.key, AssetItemType);
      const r = ({
        [AssetItemType.Image]: ga.mergeMap(([a, fr]: [AssetsOpenFile, FileResponse]) => Observable.combineLatest(
          Observable.of(`api/files?path=${a.base}`),
          this.store.select(createSelector(
            currentChildrenImages,
            children => children.map(c => absPath(c)))),
          this.store.select(selectedFile),
        ).first())
          .mergeMap(([basePath, images, selected]) => {
            const p = this.modal.open(SaImageModalComponent, {
              basePath,
              images,
              selected
            });
            return Observable.fromPromise(p.catch(e => null));
          }),
        [AssetItemType.Text]: ga.mergeMap(([a, fr]: [AssetsOpenFile, FileResponse]) => {
          const file = {...fr, path: `${a.base}/${fr.path}`};
          const p = this.modal.open(SaTextModalComponent, {file});
          return Observable.fromPromise(p.catch(e => {
            console.warn(e);
            return null
          }));
        })
      });
      return r[ga.key] || Observable.empty();
    })

    .map(_ => new AssetsCloseFile())
}
