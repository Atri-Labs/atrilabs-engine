import { BrowserForestManager } from "@atrilabs/core";
import { deleteFolder } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useSocketApi = () => {
  const onDeleteFolderCb = useCallback(
    (id: string, onSuccess: () => void, onFailure: () => void) => {
      deleteFolder(
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
