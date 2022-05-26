import { api, BrowserForestManager } from "@atrilabs/core";
import { useCallback } from "react";
import { Page } from "@atrilabs/forest";

export const useSocketApi = () => {
  const updatePageCb = useCallback(
    (
      id: string,
      update: Partial<Omit<Page, "id">>,
      onSuccess: () => void,
      onFailure: () => void
    ) => {
      api.updatePage(
        BrowserForestManager.currentForest.forestPkgId,
        id,
        update,
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
  return updatePageCb;
};
