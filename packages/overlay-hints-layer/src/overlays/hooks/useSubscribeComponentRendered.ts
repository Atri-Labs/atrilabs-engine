import { useEffect } from "react";
import { subscribeOnComponentRendered } from "@atrilabs/canvas-runtime";

export function useSubscribeComponentRendered(cb: () => void) {
  useEffect(() => {
    const unsub = subscribeOnComponentRendered((updatedCompId) => {
      cb();
    });
    return unsub;
  }, [cb]);
}
