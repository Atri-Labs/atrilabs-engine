import { api, BrowserForestManager, getId } from "@atrilabs/core";
import { useCallback } from "react";

export const useSocketApi = () => {
  const createPageCb = useCallback(
    (
      name: string,
      folderId: string,
      onSuccess: () => void,
      onFailure: () => void
    ) => {
      api.createPage(
        BrowserForestManager.currentForest.forestPkgId,
        { name: name, id: getId(), folderId: folderId },
        (success) => {
          if (success) {
            onSuccess();
          } else {
            onFailure();
          }
        }
      );
    },
    []
  );
  return createPageCb;
};
