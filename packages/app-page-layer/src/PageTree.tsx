import { useCallback, useMemo } from "react";
import { PageInfo } from "./types";
import { canvasApi } from "@atrilabs/pwa-builder-manager";
import { Tree } from "antd";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";

const { DirectoryTree } = Tree;

export const PageTree: React.FC<{
  pagesInfo: PageInfo;
  selectedPageRouteObjectPath: string;
  onCloseClicked: () => void;
}> = (props) => {
  const createTreeNodes = useCallback(
    (
      pathArr: string[],
      pathArrLen: number,
      route: string,
      treeNodes: DataNode[]
    ) => {
      const node = {
        title:
          pathArr[pathArrLen - 1] !== "" ? pathArr[pathArrLen - 1] : "index",
        isLeaf: true,
        key: route,
      };
      if (pathArrLen === 1) treeNodes.push(node);
      else {
        let tempTreeNode: DataNode[] = treeNodes;
        for (let i = 0; i < pathArrLen - 1; i++) {
          const path = pathArr[i];
          let j;
          for (j = 0; j < treeNodes.length; j++) {
            if (treeNodes[j].title === path) {
              tempTreeNode = treeNodes[j].children || [];
              break;
            }
          }
          if (j === treeNodes.length) {
            treeNodes.push({
              title: path !== "" ? path : "index",
              key: route + " " + pathArrLen,
              children: [],
            });
            tempTreeNode = treeNodes[treeNodes.length - 1].children || [];
          }
        }
        tempTreeNode.push(node);
      }
    },
    []
  );

  const treeNodes = useMemo(() => {
    const treeNodes: DataNode[] = [];
    for (let i = 0; i < props.pagesInfo.length; i++) {
      const path = props.pagesInfo[i].unixFilepath;
      const route = props.pagesInfo[i].routeObjectPath;
      const pathArr = path.split("/").slice(1);
      let pathArrLen = pathArr.length;
      createTreeNodes(pathArr, pathArrLen, route, treeNodes);
    }
    return treeNodes;
  }, [createTreeNodes, props.pagesInfo]);

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    if (info.node.children) return;
    const node = info.node.key as string;
    if (node !== "") canvasApi.navigatePage(node);
  };

  console.log("Page", treeNodes);

  return (
    <div>
      <div onClick={props.onCloseClicked}>Close Page Tree</div>
      <DirectoryTree onSelect={onSelect} treeData={treeNodes} />
    </div>
  );
};
