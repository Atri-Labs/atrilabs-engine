import { PageInfo } from "./types";

export const PageTree: React.FC<{
  pagesInfo: PageInfo;
  selectedPageRouteObjectPath: string;
  onCloseClicked: () => void;
}> = (props) => {
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
          >
            {pageInfo.routeObjectPath}
          </div>
        );
      })}
    </div>
  );
};
