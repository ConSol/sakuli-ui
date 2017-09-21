import {FileResponse} from "../../../../../sweetest-components/services/access/model/file-response.interface";

export enum AssetItemType {
  Folder, Image
}


export function getItemType(file: FileResponse): AssetItemType {
  if (file.directory) {
    return AssetItemType.Folder;
  }
  if (['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop())) {
    return AssetItemType.Image;
  }
}
