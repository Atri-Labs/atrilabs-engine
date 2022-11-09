import { useEffect } from "react";
import { sendOutOfCanvasEvent } from "../decorators/CanvasActivityDecorator";

type useAttachEventsToIframeProps = {
  iframe: HTMLIFrameElement | null;
};

export const useAttachEventsToIframe = (
  props: useAttachEventsToIframeProps
) => {
  useEffect(() => {
    if (props.iframe) {
      const mouseExitedCb = (event: MouseEvent) => {
        sendOutOfCanvasEvent();
      };
      props.iframe.contentWindow?.document.body.addEventListener(
        "mouseleave",
        mouseExitedCb
      );
      return () => {
        if (props.iframe) {
          props.iframe.contentWindow?.document.body.removeEventListener(
            "mouseleave",
            mouseExitedCb
          );
        }
      };
    }
  }, [props.iframe]);
};
