import { api, BrowserForestManager } from "@atrilabs/core";
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
      api.updateFolder(
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
  return updateFolderCb;
};
