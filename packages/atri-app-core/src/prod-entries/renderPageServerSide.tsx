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
    AppFn: React.FC<any>;
    DocFn: React.FC;
    entryUrlPath: string;
  } & Pick<ProdAppEntryOptions, "PageWrapper" | "routes">
) {
  const { srcs, AppFn, DocFn, routes, entryUrlPath } = options;
  atriRouter.setRouterFactory(createMemoryRouter);
  loadRoutes(
    { routes, PageWrapper: AppFn },
    { initialEntries: [entryUrlPath], initialIndex: 0 }
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
