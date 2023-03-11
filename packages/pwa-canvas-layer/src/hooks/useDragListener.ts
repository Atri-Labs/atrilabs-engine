import { useEffect, useState, useCallback } from "react";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";
import { CommonIcon } from "@atrilabs/atri-app-core/src/editor-components";
import { getRef } from "@atrilabs/core";
import { getOverlayStyle } from "../utils";

export function useDragListener() {
  const [DragComp, setDragComp] = useState<{
    Comp: React.FC<any>;
    props: any;
  } | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});

  const setOverlayStyleCb = useCallback(
    (loc: { pageX: number; pageY: number }) => {
      if (getRef("Dragzone")) {
        const containerEl = getRef("Dragzone").current;
        const overlayStyle = getOverlayStyle(containerEl, loc);
        setOverlayStyle(overlayStyle);
      }
    },
    []
  );

  useEffect(() => {
    const unsubDrag = subscribeEditorMachine("drag_in_progress", (context) => {
      if (context.dragComp?.comp === "CommonIcon") {
        setDragComp({ Comp: CommonIcon, props: context.dragComp.props });
        setOverlayStyleCb(context.mousePosition!);
      }
    });
    return () => {
      unsubDrag();
    };
  }, [setOverlayStyleCb]);

  useEffect(() => {
    return subscribeEditorMachine("mouse_move_during_drag", (context) => {
      if (DragComp === null && context.dragComp) {
        setDragComp({ Comp: CommonIcon, props: context.dragComp.props });
      }
      setOverlayStyleCb(context.mousePosition!);
    });
  }, [setOverlayStyleCb, DragComp]);

  useEffect(() => {
    const handleDragEnd = () => {
      setDragComp(null);
      setOverlayStyle({});
    };
    const unsubDragFailed = subscribeEditorMachine("DRAG_FAILED", () => {
      handleDragEnd();
    });
    const unsubComponentCreated = subscribeEditorMachine("DRAG_SUCCESS", () => {
      handleDragEnd();
    });
    const unsubOutsideCanvas = subscribeEditorMachine("INSIDE_CANVAS", () => {
      handleDragEnd();
    });
    return () => {
      unsubDragFailed();
      unsubComponentCreated();
      unsubOutsideCanvas();
    };
  }, []);

  return { DragComp, overlayStyle };
}
