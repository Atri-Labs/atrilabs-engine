import { useContext } from "react";
import { CANVAS_ZONE_ROOT_ID } from "../api/consts";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";
import { NormalRenderer } from "./NormalRenderer";
import { ParentRenderer } from "./ParentRenderer";

export function CanvasZone(props: { id: string }) {
  const aliasCompMap = useContext(AliasCompMapContext);
  const compTree = useContext(ComponentTreeContext)[props.id];
  return (
    <div data-atri-canvas-id={props.id}>
      {compTree[CANVAS_ZONE_ROOT_ID]?.map((childAlias) => {
        if (aliasCompMap[childAlias].type !== "normal") {
          return (
            <ParentRenderer
              alias={childAlias}
              aliasCompMap={aliasCompMap}
              componentTreeMap={compTree}
              key={childAlias}
            />
          );
        } else {
          return (
            <NormalRenderer
              alias={childAlias}
              aliasCompMap={aliasCompMap}
              key={childAlias}
            />
          );
        }
      })}
    </div>
  );
}
