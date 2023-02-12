import { useCallback, useMemo, useState } from "react";
import { PageInfo } from "./types";
import { canvasApi } from "@atrilabs/pwa-builder-manager";
import { DirectoryTree } from "./components/DirectoryTree";

export type DataNode = {
  title: string;
  route: string;
  isLeaf: boolean;
  isFolderOpen?: boolean;
  children?: DataNode[];
};

const fileTreeNodes: DataNode[] = [
  {
    title: "index.jsx",
    route: "/",
    isLeaf: true,
  },
  {
    title: "test1.jsx",
    route: "/test1",
    isLeaf: true,
  },
  {
    title: "test2.jsx",
    route: "/test2",
    isLeaf: true,
  },
  {
    title: "countries",
    route: "/countries",
    isLeaf: false,
    isFolderOpen: false,
    children: [
      {
        title: "europe",
        route: "/countries/europe",
        isLeaf: false,
        isFolderOpen: false,
        children: [
          {
            title: "france.jsx",
            route: "/countries/europe/france",
            isLeaf: true,
          },
          {
            title: "switzerland.jsx",
            route: "/countries/europe/switzerland",
            isLeaf: true,
          },
        ],
      },
      {
        title: "asia",
        route: "/countries/asia",
        isLeaf: false,
        isFolderOpen: false,
        children: [
          {
            title: "india.jsx",
            route: "/countries/asia/india",
            isLeaf: true,
          },
          {
            title: "russia.jsx",
            route: "/countries/asia/russia",
            isLeaf: true,
          },
        ],
      },
    ],
  },
];

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
  // pagesInfo: PageInfo;
  selectedPageRouteObjectPath: string;
}> = (props) => {
  // const createTreeNodes = useCallback(
  //   (
  //     pathArr: string[],
  //     pathArrLen: number,
  //     route: string,
  //     treeNodes: DataNode[]
  //   ) => {
  //     function createTreeNode(title: string, route: string, leafNode: boolean) {
  //       if (leafNode)
  //         return {
  //           title,
  //           isLeaf: true,
  //           route,
  //         };
  //       return {
  //         title,
  //         children: [],
  //         isLeaf: false,
  //         route,
  //       };
  //     }

  //     const node: DataNode = createTreeNode(
  //       pathArr[pathArrLen - 1] !== "" ? pathArr[pathArrLen - 1] : "index",
  //       route,
  //       true
  //     );

  //     let tempTreeNode: DataNode[] = treeNodes;

  //     for (let i = 0; i < pathArrLen - 1; i++) {
  //       const path = pathArr[i];

  //       const lenBeforeUpdate = tempTreeNode.length;
  //       let j;

  //       for (j = 0; j < tempTreeNode.length; j++) {
  //         if (tempTreeNode[j].title === path) {
  //           tempTreeNode = tempTreeNode[j].children || [];
  //           break;
  //         }
  //       }

  //       if (lenBeforeUpdate === j) {
  //         tempTreeNode.push(
  //           createTreeNode(path !== "" ? path : "index", path, false)
  //         );
  //         tempTreeNode = tempTreeNode[tempTreeNode.length - 1].children || [];
  //       }
  //     }

  //     tempTreeNode.push(node);
  //   },
  //   []
  // );

  // const treeNodes = useMemo(() => {
  //   const treeNodes: DataNode[] = [];
  //   for (let i = 0; i < props.pagesInfo.length; i++) {
  //     const path = props.pagesInfo[i].unixFilepath;
  //     const route = props.pagesInfo[i].routeObjectPath;
  //     const pathArr = path.split("/").slice(1);
  //     let pathArrLen = pathArr.length;
  //     createTreeNodes(pathArr, pathArrLen, route, treeNodes);
  //   }
  //   return treeNodes;
  // }, [createTreeNodes, props.pagesInfo]);

  const [treeNodesList, setTreeNodesList] = useState(fileTreeNodes);

  const onSelect = (route: string) => {
    canvasApi.navigatePage(route);
    const prevTreeNodesList = [...treeNodesList];
    setTreeNodesList(toggleFile([3], prevTreeNodesList));
  };

  console.log(treeNodesList);

  return (
    <DirectoryTree onSelect={onSelect} treeData={treeNodesList} padding={0} />
  );
};
