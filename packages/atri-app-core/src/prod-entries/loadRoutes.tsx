import { atriRouter } from "../entries/atriRouter";
import { ProdAppEntryOptions } from "../types";
import { FinalPageComponent } from "./FinalPageComponent";
import React from "react";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";
import { AtriFCStore } from "./AtriFCStore";

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
    const Page = React.lazy(() => {
      const entryName =
        route.path === "/" ? "index" : route.path.replace(/^\//, "");
      const filesToFetch: string[] = JSON.parse(
        document.getElementById("atri-asset-dep-graph")!.textContent!
      )[entryName];

      const scripts = Array.from(document.head.getElementsByTagName("script"));
      Promise.all(
        filesToFetch
          .filter((file) => {
            return (
              file.endsWith(".js") &&
              scripts.findIndex((script) => script.src.endsWith(`/${file}`)) < 0
            );
          })
          .map((file) => {
            const script = document.createElement("script");
            script.src = `/${file}`;
            script.defer = true;
            document.head.appendChild(script);
          })
      );

      Promise.all(
        filesToFetch
          .filter((file) => {
            return (
              file.endsWith(".css") &&
              scripts.findIndex((script) => script.src.endsWith(`/${file}`)) < 0
            );
          })
          .map((file) => {
            const link = document.createElement("link");
            link.href = `/${file}`;
            link.type = "stylesheet";
            document.head.appendChild(link);
          })
      );

      return new Promise<{ default: React.FC }>((resolve) => {
        const unsub = AtriFCStore.subscribe(route.path, (fc) => {
          resolve({ default: fc });
          unsub();
        });
      });
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
