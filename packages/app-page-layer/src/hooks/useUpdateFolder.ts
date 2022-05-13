import { currentForest } from "@atrilabs/core";
import { Folder, updateFolder } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useSocketApi = () => {
  const updateFolderCb = useCallback(
    (
      id: string,
      update: Partial<Omit<Folder, "id">>,
      onSuccess: () => void,
      onFailure: () => void
    ) => {
      updateFolder(currentForest.name, id, update, onSuccess, onFailure);
    },
    []
  );
  return updateFolderCb;
};
