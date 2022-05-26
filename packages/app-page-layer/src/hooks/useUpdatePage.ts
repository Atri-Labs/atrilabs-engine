import { BrowserForestManager } from "@atrilabs/core";
import { updatePage } from "@atrilabs/server-client/lib/websocket";
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
      updatePage(
        BrowserForestManager.currentForest.forestPkgId,
        id,
        update,
        onSuccess,
        onFailure
      );
    },
    []
  );
  return updatePageCb;
};
