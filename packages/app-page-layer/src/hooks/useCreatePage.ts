import { currentForest, getId } from "@atrilabs/core";
import { createPage } from "@atrilabs/server-client/lib/websocket";
import { useCallback } from "react";

export const useCreatePage = () => {
  const createPageCb = useCallback(
    (
      name: string,
      folderId: string,
      onSuccess: () => void,
      onFailure: () => void
    ) => {
      createPage(
        currentForest.name,
        { name: name, id: getId(), folderId: folderId },
        onSuccess,
        onFailure
      );
    },
    []
  );
  return createPageCb;
};
