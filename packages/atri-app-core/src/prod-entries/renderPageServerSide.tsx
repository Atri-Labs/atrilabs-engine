import {
  MainAppContext,
  AtriScriptsContext,
  ProdAppEntryOptions,
} from "@atrilabs/atri-app-core";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { atriRouter } from "../entries/atriRouter";
import { loadRoutes } from "./loadRoutes";
import { addPageToStore } from "./store";

export function renderPageServerSide(
  options: {
    srcs: string[];
    DocFn: React.FC;
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
          App: <RouterProvider router={atriRouter.getRouter()!} />,
        }}
      >
        <DocFn />
      </MainAppContext.Provider>
    </AtriScriptsContext.Provider>
  );
}
