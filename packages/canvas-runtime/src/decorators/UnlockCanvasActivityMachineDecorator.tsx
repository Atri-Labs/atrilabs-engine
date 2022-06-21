import { useEffect } from "react";
import { DecoratorProps, DecoratorRenderer } from "../DecoratorRenderer";
import { getCompDropTarget, unlockMachine } from "./CanvasActivityDecorator";

const newCompRendererdSubscribers: ((compId: string) => void)[] = [];

export function subscribeNewDropRendered(cb: (compId: string) => void) {
  newCompRendererdSubscribers.push(cb);
  return () => {
    const index = newCompRendererdSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      newCompRendererdSubscribers.splice(index, 1);
    }
  };
}

export const UnlockCanvasActivityMachineDecorator: React.FC<DecoratorProps> = (
  props
) => {
  useEffect(() => {
    const dropCompTarget = getCompDropTarget();
    if (dropCompTarget === props.compId) {
      unlockMachine();
      newCompRendererdSubscribers.forEach((cb) => {
        cb(props.compId);
      });
    }
  }, [props.compId]);
  return <DecoratorRenderer {...props} />;
};
