import { useEffect, useState } from "react";
import { editorAppMachineInterpreter } from "@atrilabs/pwa-builder-manager";

export const usePageRoutes = () => {
  const [routes, setRoutes] = useState<string[]>([]);
  useEffect(() => {
    const pageInfo = editorAppMachineInterpreter.machine.context.pagesInfo;
    if (pageInfo) {
      setRoutes(
        pageInfo.map(({ routeObjectPath }) => {
          return routeObjectPath;
        })
      );
    }
  }, []);
  return { routes };
};
