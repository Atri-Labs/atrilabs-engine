import { api, BrowserForestManager } from "@atrilabs/core";
import { useCallback } from "react";

export const useSocketApi = () => {
  const onDeleteFolderCb = useCallback(
    (id: string, onSuccess: () => void, onFailure: () => void) => {
      api.deleteFolder(
        BrowserForestManager.currentForest.forestPkgId,
        id,
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
  return onDeleteFolderCb;
};
