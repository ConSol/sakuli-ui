import {Injectable} from '@angular/core';
import {ScModalService} from "../modal/sc-modal.service";

@Injectable()
export class ScOpenFileService {

  constructor(
    readonly modal: ScModalService
  ) {
  }
}
