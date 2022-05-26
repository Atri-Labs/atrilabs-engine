import { BrowserForestManager } from "@atrilabs/core";
import { updateFolder } from "@atrilabs/server-client/lib/websocket";
import { Folder } from "@atrilabs/forest";
import { useCallback } from "react";

export const useSocketApi = () => {
  const updateFolderCb = useCallback(
    (
      id: string,
      update: Partial<Omit<Folder, "id">>,
      onSuccess: () => void,
      onFailure: () => void
    ) => {
      updateFolder(
        BrowserForestManager.currentForest.forestPkgId,
        id,
        update,
        onSuccess,
        onFailure
      );
    },
    []
  );
  return updateFolderCb;
};
