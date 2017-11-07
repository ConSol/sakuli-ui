export function absPath(f: FileResponse) {
  return [f.path,f.name].filter(p => p.length).join('/');
}

export interface FileResponse {
  type: string;
  path: string;
  name: string;
  directory: boolean
}

export interface FileWithContent {
  content: string;
  file: string;
}
