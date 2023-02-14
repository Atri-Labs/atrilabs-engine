import { useCallback, useMemo, useState } from "react";
import { PageInfo } from "./types";
import { canvasApi } from "@atrilabs/pwa-builder-manager";
import { DirectoryTree } from "./components/DirectoryTree";

export type DataNode = {
  title: string;
  route: string;
  isLeaf: boolean;
  path: number[];
  isFolderOpen?: boolean;
  children?: DataNode[];
};

function toggleFile(path: number[], fileStructure: DataNode[]) {
  let currentLevel = fileStructure;
  for (let i = 0; i < path.length; i++) {
    let index = path[i];
    let currentFile = currentLevel[index];
    if (i !== path.length - 1) currentLevel = currentFile.children || [];
    else currentFile.isFolderOpen = !currentFile.isFolderOpen;
  }
  return fileStructure;
}

export const PageTree: React.FC<{
  pagesInfo: PageInfo;
  selectedPageRouteObjectPath: string;
}> = (props) => {
  const createTreeNodes = useCallback(
    (
      pathArr: string[],
      pathArrLen: number,
      route: string,
      treeNodes: DataNode[]
    ) => {
      function createTreeNode(title: string, route: string, leafNode: boolean) {
        if (leafNode)
          return {
            title,
            route,
            isLeaf: true,
            path: [],
          };
        return {
          title,
          route,
          children: [],
          isLeaf: false,
          path: [],
          isFolderOpen: false,
        };
      }

      // Leaf node or file
      const node: DataNode = createTreeNode(
        pathArr[pathArrLen - 1] !== "" ? pathArr[pathArrLen - 1] : "index",
        route,
        true
      );

      let tempTreeNode: DataNode[] = treeNodes;
      let pathForTraversal: number[] = [];

      for (let i = 0; i < pathArrLen - 1; i++) {
        const path = pathArr[i];

        const lenBeforeUpdate = tempTreeNode.length;
        let j;

        // If path is present traverse
        for (j = 0; j < tempTreeNode.length; j++) {
          if (tempTreeNode[j].title === path) {
            tempTreeNode = tempTreeNode[j].children || [];
            break;
          }
        }

        // Get the location of the folder
        pathForTraversal = [...pathForTraversal, j];

        // Else create path
        if (lenBeforeUpdate === j) {
          tempTreeNode.push(
            createTreeNode(path !== "" ? path : "index", path, false)
          );
          tempTreeNode[tempTreeNode.length - 1].path = pathForTraversal;
          tempTreeNode = tempTreeNode[tempTreeNode.length - 1].children || [];
        }
      }

      // Get the location of the file
      pathForTraversal = [...pathForTraversal, tempTreeNode.length];
      node.path = pathForTraversal;
      tempTreeNode.push(node);
    },
    []
  );

  const treeNodes = useMemo(() => {
    const treeNodes: DataNode[] = [];
    for (let i = 0; i < props.pagesInfo.length; i++) {
      const path = props.pagesInfo[i].unixFilepath;
      const route = props.pagesInfo[i].routeObjectPath;
      if (route === "/_document") continue;
      const pathArr = path.split("/").slice(1);
      let pathArrLen = pathArr.length;
      createTreeNodes(pathArr, pathArrLen, route, treeNodes);
    }
    return treeNodes;
  }, [createTreeNodes, props.pagesInfo]);

  const [treeNodesList, setTreeNodesList] = useState(treeNodes);
  const [currSelectedPath, setCurrSelectedPath] = useState<number[]>([]);

  const onSelect = (route: string, isFolder: boolean, path: number[]) => {
    if (!isFolder) {
      canvasApi.navigatePage(route);
    } else {
      const prevTreeNodesList = [...treeNodesList];
      setTreeNodesList(toggleFile(path, prevTreeNodesList));
    }
    setCurrSelectedPath(path);
  };

  return (
    <DirectoryTree
      onSelect={onSelect}
      treeData={treeNodesList}
      padding={0}
      currSelectedPath={currSelectedPath}
    />
  );
};
