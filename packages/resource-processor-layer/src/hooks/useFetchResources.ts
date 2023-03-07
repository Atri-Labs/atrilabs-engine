import { ImportedResource } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { api } from "@atrilabs/pwa-builder-manager";

export const useFetchResources = () => {
  const [resources, setResources] = useState<ImportedResource[]>([]);

  useEffect(() => {
    api.getResources((resources) => {
      setResources(resources);
      // add to canvas
      resources.forEach((resource) => {
        if (resource.method === "css") {
          // TODO
        }
      });
    });
  }, []);

  useEffect(() => {
    api.subscribeResourceUpdates((resource) => {
      setResources((old) => [...old, resource]);
      // add to canvas
      if (resource.method === "css") {
        // TODO
      }
    });
  }, []);

  return { resources };
};
