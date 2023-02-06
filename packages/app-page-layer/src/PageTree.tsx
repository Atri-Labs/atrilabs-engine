import { useCallback } from "react";
import { PageInfo } from "./types";
import { api } from "@atrilabs/pwa-builder-manager";

export const PageTree: React.FC<{
  pagesInfo: PageInfo;
  selectedPageRouteObjectPath: string;
  onCloseClicked: () => void;
}> = (props) => {
  const onPageClicked = useCallback((urlPath: string) => {
    api.navigatePage(urlPath);
  }, []);
  return (
    <div>
      <div onClick={props.onCloseClicked}>Close Page Tree</div>
      {props.pagesInfo.map((pageInfo) => {
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
