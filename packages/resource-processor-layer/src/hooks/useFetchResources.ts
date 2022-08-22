import { api, ImportedResource } from "@atrilabs/core";
import { useEffect, useState } from "react";

export const useFetchResources = () => {
  const [resources, setResources] = useState<ImportedResource[]>([]);

  useEffect(() => {
    api.getResources((resources) => {
      setResources(resources);
    });
  }, []);

  useEffect(() => {
    api.subscribeResourceUpdates((resource) => {
      setResources((old) => [...old, resource]);
    });
  }, []);

  return { resources };
};
