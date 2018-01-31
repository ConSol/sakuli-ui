import {EntityState} from "@ngrx/entity";
import {FileResponse} from "../../../services/access/model/file-response.interface";

export interface ScOpenFileState extends EntityState<FileResponse> {
  isOpen: boolean
}
