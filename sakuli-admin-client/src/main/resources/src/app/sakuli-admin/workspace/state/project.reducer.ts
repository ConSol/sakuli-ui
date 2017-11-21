import {WorkspaceState, WorkspaceStateInit} from './project.interface';
import * as Actions from './project.actions';
import {absPath, FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {Tree} from "../../../sweetest-components/components/presentation/tree/tree.interface";

function fileToTreeItem(file: FileResponse) {
  return ({
    ...file,
    open: false,
    busy: false,
    children: []
  })
}

function filesToTreeItems(files: FileResponse[]) {
  return files.map(fileToTreeItem);
}

function recursiveTreeWalker(filter: (item: Tree<FileResponse>) => boolean,
                             walker: (item: Tree<FileResponse>) => Tree<FileResponse>,
                             tree: Tree<FileResponse>): Tree<FileResponse> {
  tree.children = tree.children.map(child => recursiveTreeWalker(filter, walker, child));
  if (filter(tree)) {
    return walker(tree);
  }
  return tree;
}

export function projectReducer(state: WorkspaceState, action: Actions.All): WorkspaceState {
  switch (action.type) {
    case Actions.OPEN: {
      const {file} = action;
      return ({...state, workspace: absPath(file)})
    }
    case Actions.SELECT_FILE: {
      const {file: selectedFile} = action;
      return ({...state, selectedFile});
    }
    case Actions.LOAD_PATH: {
      const {path} = action;
      const fileTree = state.fileTree.map(tree => recursiveTreeWalker(
        i => path === absPath(i),
        i => ({busy: true, ...i}),
        tree
      ));
      return ({...state, fileTree});
    }
    case Actions.TOGGLE_OPEN: {
      const {item} = action;
      const fileTree = state.fileTree.map(tree => recursiveTreeWalker(
        i => absPath(i) === absPath(item),
        i => ({open: !i.open, ...i}),
        tree
      ));
      return ({...state, fileTree});
    }
    case Actions.APPEND_CHILDREN: {
      const {path, children} = action;
      const fileTree = (path === '') ? filesToTreeItems(children) :
        state.fileTree.map(tree => recursiveTreeWalker(
          i => absPath(i) === path,
          i => ({...i, children: filesToTreeItems(children)}),
          tree
        ))
      return ({...state, fileTree});
    }
  }
  return state || WorkspaceStateInit;
}
