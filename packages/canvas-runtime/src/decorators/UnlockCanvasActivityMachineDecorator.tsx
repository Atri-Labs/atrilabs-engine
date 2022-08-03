import { useEffect } from "react";
import { canvasComponentStore } from "../CanvasComponentData";
import { DecoratorProps, DecoratorRenderer } from "../DecoratorRenderer";
import {
  getCompDropTarget,
  getTemplateRootId,
  unlockMachine,
} from "./CanvasActivityDecorator";

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

    const dropNewTemplateRootId = getTemplateRootId();
    if (dropNewTemplateRootId === props.compId) {
      unlockMachine();
      // Shall we notify new component rendered for all children of template?
      newCompRendererdSubscribers.forEach((cb) => {
        cb(props.compId);
      });
    }
  }, [props.compId]);
  // Set properties/attributes that hinder drag-drop on canvas
  // so that they don't interfer. For ex: user-select, draggable
  useEffect(() => {
    if (canvasComponentStore[props.compId]) {
      const topElement = canvasComponentStore[props.compId].ref.current;
      if (topElement) {
        topElement.style.userSelect = "none";
        topElement.setAttribute("draggable", "false");
        topElement.tabIndex = 0;
      }
    }
  }, [props.compId]);
  return <DecoratorRenderer {...props} />;
};
