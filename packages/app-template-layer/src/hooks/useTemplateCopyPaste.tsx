import { useCallback } from "react";
import { useClipboard } from "./useClipboard";
import { useCreateTemplate } from "./useCreateTemplate";
import { useListenCopyPaste } from "./useListenCopyPaste";

export const useTemplateCopyPaste = () => {
  const createTemplate = useCreateTemplate();
  const { putInClipboard, getFromClipboard } = useClipboard();

  const onCopy = useCallback(
    (selectedId: string) => {
      const template = createTemplate(selectedId, {
        copyCallbacks: true,
        copyDefaulCallbacks: false,
      });
      putInClipboard(JSON.stringify({ type: "template", template }));
    },
    [createTemplate, putInClipboard]
  );

  const onPaste = useCallback((selectedId: string) => {}, []);

  useListenCopyPaste({ onCopyKeyPressed: onCopy, onPasteKeyPressed: onPaste });
};
