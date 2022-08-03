import { api, BrowserForestManager } from "@atrilabs/core";
import { useMemo } from "react";

export const usePageRoutes = () => {
  // get all page routes
  const routes = useMemo(() => {
    const routes: string[] = [];
    const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
    api.getPages(forestPkgId, (pages) => {
      const pageIds = Object.keys(pages);
      pageIds.forEach((pageId) => {
        routes.push(pages[pageId].route);
      });
    });
    return routes;
  }, []);
  return { routes };
};
