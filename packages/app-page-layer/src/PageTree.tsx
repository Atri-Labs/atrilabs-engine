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
    console.log("Trigger Select", keys, info);
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    const node =
      info.node.children!.length > 0
        ? (info.node.children![0].key as string)
        : "";
    if (node !== "") canvasApi.navigatePage(node);
  };

  // const onPageClicked = useCallback((urlPath: string) => {
  //   canvasApi.navigatePage(urlPath);
  // }, []);

  console.log("Page", treeNodes);

  return (
    <div>
      <div onClick={props.onCloseClicked}>Close Page Tree</div>
      {/* {props.pagesInfo.map((pageInfo) => {
        console.log("pageInfo", pageInfo);
        return (
          <div
            style={{
              background:
                props.selectedPageRouteObjectPath === pageInfo.routeObjectPath
                  ? "cyan"
                  : undefined,
            }}
            key={pageInfo.routeObjectPath}
            onClick={() => {
              onPageClicked(pageInfo.routeObjectPath);
            }}
          >
            {pageInfo.routeObjectPath}
          </div>
        );
      })} */}
      <DirectoryTree
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeNodes}
      />
    </div>
  );
};
