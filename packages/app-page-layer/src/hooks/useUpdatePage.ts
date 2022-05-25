import { currentForest } from "@atrilabs/core";
import { Page, updatePage } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useSocketApi = () => {
  const updatePageCb = useCallback(
    (
      id: string,
      update: Partial<Omit<Page, "id">>,
      onSuccess: () => void,
      onFailure: () => void
    ) => {
      updatePage(currentForest.forestPkg, id, update, onSuccess, onFailure);
    },
    []
  );
  return updatePageCb;
};
