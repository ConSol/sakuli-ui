export function absPath(f: FileResponse) {
  return [f.path,f.name].filter(p => p.length).join('/');
}

export interface FileResponse {
  path: string;
  name: string;
  directory: boolean
}

export interface FileWithContent {
  content: string;
  file: string;
}

export const fileResponseFromPath = (pathString: string, forcingFile: boolean = false):FileResponse => {
  const parts = pathString.split('/');
  const name = parts.pop();
  const path = parts.join('/');
  const pathParts = parts;
  return ({
    name,
    path,
    directory: !name.includes('.') && !forcingFile
  })
};
