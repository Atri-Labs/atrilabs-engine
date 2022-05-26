import { BrowserForestManager, getId } from "@atrilabs/core";
import { createFolder } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useSocketApi = () => {
  const createFolderCb = useCallback(
    (name: string, onSuccess: () => void, onFailure: () => void) => {
      createFolder(
        BrowserForestManager.currentForest.forestPkgId,
        { name: name, id: getId(), parentId: "root" },
        onSuccess,
        onFailure
      );
    },
    []
  );
  return createFolderCb;
};
