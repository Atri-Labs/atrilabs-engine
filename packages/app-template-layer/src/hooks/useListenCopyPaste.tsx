import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import { useEffect, useRef } from "react";

type ListenCopyPasteProps = {
  onCopyKeyPressed: (selectedId: string) => void;
  onPasteKeyPressed: (selectedId: string) => void;
};

export const useListenCopyPaste = (props: ListenCopyPasteProps) => {
  const metaKeyDown = useRef<boolean>(false);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("keydown", (context, event) => {
      if (event.type !== "keydown") {
        return;
      }
      const keyEvent = event.event;
      keyEvent.preventDefault();

      if (window.navigator && window.navigator.userAgent) {
        if (window.navigator.userAgent.indexOf("Mac") >= 0) {
          if (keyEvent.metaKey) {
            metaKeyDown.current = true;
          }
        } else {
          if (keyEvent.ctrlKey) {
            metaKeyDown.current = true;
          }
        }

        if (metaKeyDown.current && context.select?.id) {
          if (keyEvent.key.toLowerCase() === "c") {
            props.onCopyKeyPressed(context.select.id);
          }
          if (keyEvent.key.toLowerCase() === "v") {
            props.onPasteKeyPressed(context.select.id);
          }
        }
      } else {
        console.log(
          "We expect window.navigator to be available for Copy-Paste to work."
        );
      }
    });
    return unsub;
  }, [props]);

  useEffect(() => {
    const unsub = subscribeCanvasActivity("keyup", (_context, event) => {
      if (event.type !== "keyup") {
        return;
      }
      const keyEvent = event.event;
      keyEvent.preventDefault();

      if (window.navigator && window.navigator.userAgent) {
        // set metaKey to false if keyup on meta key
        if (window.navigator.userAgent.indexOf("Mac") >= 0) {
          if (keyEvent.metaKey) {
            metaKeyDown.current = false;
          }
        } else {
          if (keyEvent.ctrlKey) {
            metaKeyDown.current = false;
          }
        }
      } else {
        console.log(
          "We expect window.navigator to be available for Copy-Paste to work."
        );
      }
    });
    return unsub;
  }, [props]);
};
