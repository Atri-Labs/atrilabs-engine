import { atriRouter } from "../entries/atriRouter";
import { ProdAppEntryOptions } from "../types";
import { FinalPageComponent } from "./FinalPageComponent";
import React from "react";

export function loadRoutes(
  props: Pick<
    ProdAppEntryOptions,
    "PageWrapper" | "routes" | "styles" | "entryRouteObjectPath" | "entryPageFC"
  >,
  routerOpts: Parameters<typeof atriRouter.setPages>["1"]
) {
  const routes = props.routes.map((route) => {
    if (route.path === props.entryRouteObjectPath) {
      return {
        path: route.path,
        // use import for non-entry/non-active routes
        element: (
          <FinalPageComponent
            PageWrapper={props.PageWrapper}
            Page={props.entryPageFC}
            styleStr={props.styles}
          />
        ),
      };
    }
    const Page = React.lazy(() =>
      // @ts-ignore
      __non_webpack_require__(`/atri/js/${route.path}`)
    );
    return {
      path: route.path,
      element: (
        <React.Suspense fallback={<>Loading...</>}>
          <Page />
        </React.Suspense>
      ),
    };
  });
  atriRouter.setPages(routes, routerOpts);
}
