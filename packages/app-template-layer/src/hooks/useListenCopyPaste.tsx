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
      console.log("keydown rec");
      if (
        window.navigator &&
        window.navigator.userAgent &&
        event.type === "keydown"
      ) {
        const keyEvent = event.event;
        if (window.navigator.userAgent.indexOf("Mac")) {
          if (keyEvent.metaKey) {
            metaKeyDown.current = true;
          }
        } else {
          if (keyEvent.ctrlKey) {
            metaKeyDown.current = true;
          }
        }

        console.log(
          "kedown",
          metaKeyDown.current,
          context.select?.id,
          keyEvent
        );
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
    const unsub = subscribeCanvasActivity("keyup", (context, event) => {
      if (
        window.navigator &&
        window.navigator.userAgent &&
        event.type === "keyup"
      ) {
        const keyEvent = event.event;
        // set metaKey to false if keyup on meta key
        if (window.navigator.userAgent.indexOf("Mac")) {
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
