import { useEffect } from "react";
import { canvasComponentStore } from "../CanvasComponentData";
import { DecoratorProps, DecoratorRenderer } from "../DecoratorRenderer";
import {
  getCompDropTarget,
  getTemplateRootId,
  unlockMachine,
} from "./CanvasActivityDecorator";

const alertsForComps: { compId: string; cb: () => void }[] = [];
export function subscribeComponentRender(compId: string, cb: () => void) {
  alertsForComps.push({ compId, cb });
  return () => {
    // CAUTION
    // user might have set two listeners with same cb & compId
    // this will always remove the first one on unsub
    const index = alertsForComps.findIndex(
      (curr) => curr.cb === cb && curr.compId === compId
    );
    if (index >= 0) {
      alertsForComps.splice(index, 1);
    }
  };
}

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

    const successfulAlerts = [...alertsForComps].filter(
      (curr) => curr.compId === props.compId
    );
    successfulAlerts.forEach((curr) => {
      try {
        curr.cb();
      } catch {
        // do nothing on a cb error
      }
    });
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
  useEffect(() => {
    function setDescendantsTabIndexToNegOne(element: Element) {
      // make all descendants un-focusable
      const count = element.childElementCount;
      const childElements = element.children;
      for (let i = 0; i < count; i++) {
        const childElement = childElements[i];
        setDescendantsTabIndexToNegOne(childElement);
        childElement.setAttribute("tabindex", "-1");
        if (
          childElement.ELEMENT_NODE &&
          process.env["ATRI_TOOL_MODE"] !== "component_development"
        ) {
          (childElement as HTMLElement).style.pointerEvents = "none";
        }
      }
    }
    if (
      canvasComponentStore[props.compId].ref.current &&
      !canvasComponentStore[props.compId].acceptsChild
    ) {
      setDescendantsTabIndexToNegOne(
        canvasComponentStore[props.compId].ref.current!
      );
    }
  }, [props.compId]);
  return <DecoratorRenderer {...props} />;
};
