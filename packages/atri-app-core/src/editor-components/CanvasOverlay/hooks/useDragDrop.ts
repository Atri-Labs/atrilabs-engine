import { useEffect, useState } from "react";
import { subscribeCanvasMachine } from "../../../api";
import { CommonIcon } from "../../CommonIcon";
import { manifestRegistryController } from "@atrilabs/manifest-registry";

export function useDragDrop() {
  const [dragFC, setDragFC] = useState<{
    Comp: React.FC<any>;
    props: any;
  } | null>(null);
  const [dragOverlayStyle, setDragOverlayStyle] =
    useState<React.CSSProperties | null>(null);
  useEffect(() => {
    const unsubMove = subscribeCanvasMachine("moveWhileDrag", (context) => {
      if (context.dragComp?.comp === "CommonIcon") {
        setDragFC({
          Comp: CommonIcon,
          props: context.dragComp.props,
        });
        setDragOverlayStyle({
          position: "absolute",
          top: context.mousePosition!.pageY + 10,
          left: context.mousePosition!.pageX + 10,
        });
      }
    });
    const unsubUp = subscribeCanvasMachine("upWhileDrag", (context) => {
      setDragFC(null);
      setDragOverlayStyle(null);
      if (context.dragData) {
        const registry = manifestRegistryController.readManifestRegistry();
        const fullManifest = registry[
          context.dragData.data.manifestSchema
        ].manifests.find((curr) => {
          return (
            curr.pkg === context.dragData?.data.pkg &&
            curr.manifest.meta.key === context.dragData?.data.key
          );
        });
        console.log(fullManifest);
      }
    });
    const unsubOutsideCanvas = subscribeCanvasMachine("OUTSIDE_CANVAS", () => {
      setDragFC(null);
      setDragOverlayStyle(null);
    });
    return () => {
      unsubMove();
      unsubUp();
      unsubOutsideCanvas();
    };
  }, []);
  return { dragFC, dragOverlayStyle };
}
