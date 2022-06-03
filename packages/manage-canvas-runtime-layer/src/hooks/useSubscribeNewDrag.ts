import { subscribeNewDrag } from "@atrilabs/canvas-runtime";
import { useEffect } from "react";

export const useSubscribeNewDrag = () => {
  useEffect(() => {
    const unsub = subscribeNewDrag((_args, _loc, caughtBy) => {});
    return unsub;
  }, []);
};
