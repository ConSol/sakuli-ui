import {EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {FileResponse} from "../../../../sweetest-components/services/access/model/file-response.interface";

export const AssetItemStyle = `
    .card {
      margin-bottom: 1rem;
      cursor: pointer;
      flex-grow: 1
    }

    .card-img-top {
      border-bottom-width: 1px;
    }

    .card-img-top img {
      max-width: 100%;
      width: auto;
    }

    .card-img-top * {
      margin: 5px;
      max-width: 90%;
    }

    .card-footer .card-text {
      text-wrap: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }

    `;

export interface AssetItem {
  item: FileResponse;
  basePath: string;
  delete: EventEmitter<FileResponse>;
  click: EventEmitter<FileResponse>;

  readonly hostBindingClass: string;

  onClick(file: FileResponse):void;
  onDelete(file: FileResponse):void;

}

export class AbstractAssetItem {
  @Input() item: FileResponse;
  @Input() basePath;
  @Output() delete = new EventEmitter<FileResponse>();
  @Output() click = new EventEmitter<FileResponse>();

  @HostBinding('class')
  get hostBindingClass() {
    return 'card-wrapper col-12 col-md-4 col-lg-3 col-xl-2 d-flex flex-column';
  }


  onClick(file :FileResponse) {
    this.click.next(file);
  }

  onDelete(file: FileResponse) {
    this.delete.next(file);
  }
}
