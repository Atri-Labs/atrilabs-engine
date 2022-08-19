import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import { useEffect } from "react";

type ListenCopyPasteProps = {
  onCopyKeyPressed: (selectedId: string) => void;
  onPasteKeyPressed: (selectedId: string) => void;
};

export const useListenCopyPaste = (props: ListenCopyPasteProps) => {
  useEffect(() => {
    subscribeCanvasActivity("keyup", (context, event) => {
      if (
        window.navigator &&
        window.navigator.userAgent &&
        event.type === "keyup"
      ) {
        const keyEvent = event.event;
        if (window.navigator.userAgent.indexOf("Mac")) {
          if (keyEvent.metaKey && keyEvent.key === "C" && context.select?.id) {
            props.onCopyKeyPressed(context.select.id);
          }
          if (keyEvent.metaKey && keyEvent.key === "V" && context.select?.id) {
            props.onPasteKeyPressed(context.select.id);
          }
        } else {
          if (keyEvent.ctrlKey && keyEvent.key === "C" && context.select?.id) {
            props.onCopyKeyPressed(context.select.id);
          }
          if (keyEvent.ctrlKey && keyEvent.key === "V" && context.select?.id) {
            props.onPasteKeyPressed(context.select.id);
          }
        }
      } else {
        console.log(
          "We expect window.navigator to be available for Copy-Paste to work."
        );
      }
    });
  }, [props]);
};
