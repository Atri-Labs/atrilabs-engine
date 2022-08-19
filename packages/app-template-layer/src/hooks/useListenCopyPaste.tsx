import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import { useEffect } from "react";

type ListenCopyPasteProps = {
  onCopyKeyPressed: () => void;
  onPasteKeyPressed: () => void;
};

export const useListenCopyPaste = (props: ListenCopyPasteProps) => {
  useEffect(() => {
    subscribeCanvasActivity("keyup", (_context, event) => {
      if (
        window.navigator &&
        window.navigator.userAgent &&
        event.type === "keyup"
      ) {
        const keyEvent = event.event;
        if (window.navigator.userAgent.indexOf("Mac")) {
          if (keyEvent.metaKey && keyEvent.key === "C") {
            props.onCopyKeyPressed();
          }
          if (keyEvent.metaKey && keyEvent.key === "V") {
            props.onPasteKeyPressed();
          }
        } else {
          if (keyEvent.ctrlKey && keyEvent.key === "C") {
            props.onCopyKeyPressed();
          }
          if (keyEvent.ctrlKey && keyEvent.key === "V") {
            props.onPasteKeyPressed();
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
