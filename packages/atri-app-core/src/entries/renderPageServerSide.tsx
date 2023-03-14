import { MainAppContext, AtriScriptsContext } from "@atrilabs/atri-app-core";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { atriRouter } from "./atriRouter";
import loadPage from "./loadPage";

export function renderPageServerSide(options: {
  scriptSrcs: string[];
  manifestRegistrySrcs: string[];
  baseSrcs: string[];
  PageFn: React.FC;
  AppFn: React.FC<any>;
  DocFn: React.FC;
}) {
  const { manifestRegistrySrcs, scriptSrcs, AppFn, PageFn, DocFn, baseSrcs } =
    options;
  atriRouter.setRouterFactory(createMemoryRouter);
  // TODO: replace "/" with the routeObjectPath
  loadPage(atriRouter, "/", AppFn, PageFn);
  return renderToString(
    <AtriScriptsContext.Provider
      value={{
        pages: scriptSrcs,
        manifestRegistry: manifestRegistrySrcs,
        base: baseSrcs,
      }}
    >
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
