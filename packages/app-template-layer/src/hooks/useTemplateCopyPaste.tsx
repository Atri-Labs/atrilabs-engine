import { useCallback } from "react";
import { useClipboard } from "./useClipboard";
import { useCreateTemplate } from "./useCreateTemplate";
import { useListenCopyPaste } from "./useListenCopyPaste";
import { computeChildIndex } from "@atrilabs/canvas-runtime-utils";

export const useTemplateCopyPaste = () => {
  const createTemplate = useCreateTemplate();
  const { putInClipboard, getFromClipboard } = useClipboard();

  const onCopy = useCallback(
    (selectedId: string) => {
      console.log("onCopyCalled");
      const template = createTemplate(selectedId, {
        copyCallbacks: true,
        copyDefaulCallbacks: false,
      });
      putInClipboard(
        JSON.stringify({ type: "template", template, copiedId: selectedId })
      );
    },
    [createTemplate, putInClipboard]
  );

  const onPaste = useCallback(
    (selectedId: string) => {
      console.log(selectedId);
      getFromClipboard()?.then((text) => {
        console.log(text);
      });
    },
    [getFromClipboard]
  );

  useListenCopyPaste({ onCopyKeyPressed: onCopy, onPasteKeyPressed: onPaste });
};
