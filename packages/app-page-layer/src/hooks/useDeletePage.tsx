import { currentForest } from "@atrilabs/core";
import { deletePage } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useSocketApi = () => {
  const onDeleteFolderCb = useCallback(
    (id: string, onSuccess: () => void, onFailure: () => void) => {
      deletePage(currentForest.name, id, onSuccess, onFailure);
    },
    []
  );
  return onDeleteFolderCb;
};
