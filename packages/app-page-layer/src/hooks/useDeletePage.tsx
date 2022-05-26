import { BrowserForestManager } from "@atrilabs/core";
import { deletePage } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useSocketApi = () => {
  const onDeleteFolderCb = useCallback(
    (id: string, onSuccess: () => void, onFailure: () => void) => {
      deletePage(
        BrowserForestManager.currentForest.forestPkgId,
        id,
        onSuccess,
        onFailure
      );
    },
    []
  );
  return onDeleteFolderCb;
};
