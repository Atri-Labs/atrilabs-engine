import { api, ImportedResource } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { addStylesheet } from "@atrilabs/canvas-runtime";

export const useFetchResources = () => {
  const [resources, setResources] = useState<ImportedResource[]>([]);

  useEffect(() => {
    api.getResources((resources) => {
      setResources(resources);
      // add to canvas
      resources.forEach((resource) => {
        if (resource.method === "css") {
          addStylesheet({ content: resource.str });
        }
      });
    });
  }, []);

  useEffect(() => {
    api.subscribeResourceUpdates((resource) => {
      setResources((old) => [...old, resource]);
      // add to canvas
      if (resource.method === "css") {
        addStylesheet({ content: resource.str });
      }
    });
  }, []);

  return { resources };
};
