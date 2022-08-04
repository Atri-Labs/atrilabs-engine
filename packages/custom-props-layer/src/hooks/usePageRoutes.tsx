import { api, BrowserForestManager } from "@atrilabs/core";
import { useEffect, useState } from "react";

export const usePageRoutes = () => {
  const [routes, setRoutes] = useState<string[]>([]);
  useEffect(() => {
    const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
    api.getPages(forestPkgId, (pages) => {
      const routes: string[] = [];
      const pageIds = Object.keys(pages);
      pageIds.forEach((pageId) => {
        routes.push(pages[pageId].route);
      });
      setRoutes(routes);
    });
  }, []);
  return { routes };
};
