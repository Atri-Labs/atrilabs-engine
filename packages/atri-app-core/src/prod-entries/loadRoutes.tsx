import { atriRouter } from "../entries/atriRouter";
import { ProdAppEntryOptions } from "../types";
import { FinalPageComponent } from "./FinalPageComponent";
import React from "react";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";

export function loadRoutes(
  props: ProdAppEntryOptions,
  routerOpts: Parameters<typeof atriRouter.setPages>["1"]
) {
  const routes = props.routes.map((route) => {
    if (route.path === props.entryRouteObjectPath) {
      return {
        path: route.path,
        // use import for non-entry/non-active routes
        element: (
          <AliasCompMapContext.Provider value={props.aliasCompMap}>
            <ComponentTreeContext.Provider value={props.componentTree}>
              <FinalPageComponent
                PageWrapper={props.PageWrapper}
                Page={props.entryPageFC}
                styleStr={props.styles}
              />
            </ComponentTreeContext.Provider>
          </AliasCompMapContext.Provider>
        ),
      };
    }
    const Page = React.lazy(async () => {
      return {
        default: () => {
          return <div>Lazy Component</div>;
        },
      };
    });
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
