import { useEffect, useState } from "react";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";
import { CommonIcon } from "@atrilabs/atri-app-core/src/editor-components";

export function useDragListener() {
  const [DragComp, setDragComp] = useState<{
    Comp: React.FC<any>;
    props: any;
  } | null>(null);
  useEffect(() => {
    subscribeEditorMachine("drag_started", (context) => {
      if (context.dragComp?.comp === "CommonIcon") {
        setDragComp({ Comp: CommonIcon, props: context.dragComp.props });
      }
    });
  }, []);
  return { DragComp };
}
