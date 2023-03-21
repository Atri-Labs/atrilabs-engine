import {
  MainAppContext,
  AtriScriptsContext,
  ProdAppEntryOptions,
} from "@atrilabs/atri-app-core";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { atriRouter } from "../entries/atriRouter";
import { loadRoutes } from "./loadRoutes";

export function renderPageServerSide(
  options: {
    srcs: string[];
    DocFn: React.FC;
    entryRouteObjectPath: string;
  } & Pick<ProdAppEntryOptions, "PageWrapper" | "routes" | "styles">
) {
  const { srcs, PageWrapper, DocFn, routes, entryRouteObjectPath, styles } =
    options;
  atriRouter.setRouterFactory(createMemoryRouter);
  loadRoutes(
    { routes, PageWrapper, styles, entryRouteObjectPath },
    { initialEntries: [entryRouteObjectPath], initialIndex: 0 }
  );
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
