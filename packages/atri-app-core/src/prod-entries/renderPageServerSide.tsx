import {
  MainAppContext,
  AtriScriptsContext,
} from "@atrilabs/atri-app-core/src/contexts";
import type {
  AliasCompMapContextType,
  ComponentTreeContextType,
  ProdAppEntryOptions,
} from "@atrilabs/atri-app-core/src/types";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { atriRouter } from "../entries/atriRouter";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";
import { loadRoutes } from "./loadRoutes";
import { addPageToStore } from "./store";

export function renderPageServerSide(
  options: {
    srcs: string[];
    DocFn: React.FC;
    aliasCompMap: AliasCompMapContextType;
    componentTree: ComponentTreeContextType;
  } & Pick<
    ProdAppEntryOptions,
    | "PageWrapper"
    | "routes"
    | "styles"
    | "entryRouteStore"
    | "entryRouteObjectPath"
    | "entryPageFC"
  >
) {
  const {
    srcs,
    PageWrapper,
    DocFn,
    routes,
    entryRouteObjectPath,
    styles,
    entryRouteStore,
    entryPageFC,
    aliasCompMap,
    componentTree,
  } = options;
  atriRouter.setRouterFactory(createMemoryRouter);
  loadRoutes(
    { routes, PageWrapper, styles, entryRouteObjectPath, entryPageFC },
    { initialEntries: [entryRouteObjectPath], initialIndex: 0 }
  );
  addPageToStore(entryRouteObjectPath, entryRouteStore);
  return renderToString(
    <AtriScriptsContext.Provider value={srcs}>
      <MainAppContext.Provider
        value={{
          App: (
            <AliasCompMapContext.Provider value={aliasCompMap}>
              <ComponentTreeContext.Provider value={componentTree}>
                <RouterProvider router={atriRouter.getRouter()!} />
              </ComponentTreeContext.Provider>
            </AliasCompMapContext.Provider>
          ),
        }}
      >
        <DocFn />
      </MainAppContext.Provider>
    </AtriScriptsContext.Provider>
  );
}
