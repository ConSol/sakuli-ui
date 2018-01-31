import {Injectable} from "@angular/core";
import {ScModalService} from "../modal/sc-modal.service";
import {Store} from "@ngrx/store";
import {ScFileSelectorModalComponent} from "./sc-file-selector-modal.component";
import {
  AddFileSelectorFiles,
  FileSelectorFile,
  FileSelectorFileFromFileResponse,
  fileSelectorSelectors,
  OPEN_FILESELECTORFILE,
  OpenFileSelectorFile
} from "./file-selector.state";
import {Actions, Effect} from "@ngrx/effects";
import {FileService} from "../../../services/access/file.service";
import {absPath} from "../../../services/access/model/file-response.interface";

@Injectable()
export class ScFileSelectorService {
  constructor(
    readonly modal: ScModalService,
    readonly store: Store<any>,
    readonly actions$: Actions,
    readonly fileService: FileService
  ) {}

  openModal(config: Partial<ScFileSelectorModalComponent>): Promise<FileSelectorFile[]> {
      return this.modal.open(ScFileSelectorModalComponent, config);
  }

  @Effect()
  private open$ = this.actions$.ofType(OPEN_FILESELECTORFILE)
    .mergeMap((a: OpenFileSelectorFile) => this.store
      .select(fileSelectorSelectors.selectEntities).first().map(e => e[a.id])
    )
    .mergeMap((e: FileSelectorFile) => this.fileService.files(absPath(e)))
    .map(fr => fr.map(FileSelectorFileFromFileResponse))
    .map(fr => new AddFileSelectorFiles(fr))
}
