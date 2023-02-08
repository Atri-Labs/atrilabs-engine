import { useCallback, useMemo } from "react";
import { PageInfo } from "./types";
import { canvasApi } from "@atrilabs/pwa-builder-manager";

type treeNode = {
  title: string;
  key: string;
  children?: treeNode[];
  isLeaf?: boolean;
};

export const PageTree: React.FC<{
  pagesInfo: PageInfo;
  selectedPageRouteObjectPath: string;
  onCloseClicked: () => void;
}> = (props) => {
  const createTreeNodes = useCallback(
    (pathArr: string[], pathArrLen: number, treeNodes: treeNode[]) => {
      const node = {
        title:
          pathArr[pathArrLen - 1] !== "" ? pathArr[pathArrLen - 1] : "index",
        isLeaf: true,
        key: pathArr[pathArrLen - 1] + " " + pathArrLen,
      };
      if (pathArrLen === 1) treeNodes.push(node);
      else {
        let tempTreeNode: treeNode[] = treeNodes;
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
              key: path + " " + pathArrLen,
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
    const treeNodes: treeNode[] = [];
    for (let i = 0; i < props.pagesInfo.length; i++) {
      const path = props.pagesInfo[i].unixFilepath;
      const pathArr = path.split("/").slice(1);
      let pathArrLen = pathArr.length;
      createTreeNodes(pathArr, pathArrLen, treeNodes);
    }
    return treeNodes;
  }, [createTreeNodes, props.pagesInfo]);

  const onPageClicked = useCallback((urlPath: string) => {
    canvasApi.navigatePage(urlPath);
  }, []);

  console.log("Page", treeNodes);

  return (
    <div>
      <div onClick={props.onCloseClicked}>Close Page Tree</div>
      {props.pagesInfo.map((pageInfo) => {
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
      })}
    </div>
  );
};
