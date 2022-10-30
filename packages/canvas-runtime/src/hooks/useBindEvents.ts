import { useEffect } from "react";

/**
 * This hook binds iFrame.contentWindow events with window
 * @param iFrame
 */
export const useBindEvents = (iFrame: HTMLIFrameElement | null) => {
  useEffect(() => {
    const bindKeydownEvent = (event: KeyboardEvent) => {
      const keydownEvent = new KeyboardEvent("keydown", event);
      window.dispatchEvent(keydownEvent);
    };
    iFrame?.contentWindow?.addEventListener("keydown", bindKeydownEvent);
    return () => {
      iFrame?.contentWindow?.removeEventListener("keydown", bindKeydownEvent);
    };
  }, [iFrame]);
};
