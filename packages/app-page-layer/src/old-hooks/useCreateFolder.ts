import { api, BrowserForestManager, getId } from "@atrilabs/core";
import { useCallback } from "react";

export const useSocketApi = () => {
  const createFolderCb = useCallback(
    (name: string, onSuccess: () => void, onFailure: () => void) => {
      api.createFolder(
        BrowserForestManager.currentForest.forestPkgId,
        { name: name, id: getId(), parentId: "root" },
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
  return createFolderCb;
};
