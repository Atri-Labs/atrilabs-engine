import { atriRouter } from "../entries/atriRouter";
import { ProdAppEntryOptions } from "../types";
import { FinalPageComponent } from "./FinalPageComponent";

export function loadRoutes(
  props: Pick<ProdAppEntryOptions, "PageWrapper" | "routes">,
  routerOpts: Parameters<typeof atriRouter.setPages>["1"]
) {
  const routes = props.routes.map((route) => {
    return {
      path: route.path,
      // use import for non-entry/non-active routes
      element: (
        <FinalPageComponent
          PageWrapper={props.PageWrapper}
          Page={route.PageFC}
        />
      ),
    };
  });
  atriRouter.setPages(routes, routerOpts);
}
