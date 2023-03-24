import { useContext } from "react";
import { CANVAS_ZONE_ROOT_ID } from "../api/consts";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";
import { NormalRenderer } from "./NormalRenderer";
import { ParentRenderer } from "./ParentRenderer";

export function CanvasZone(props: { id: string }) {
  const aliasCompMap = useContext(AliasCompMapContext);
  const compTree = useContext(ComponentTreeContext)[props.id];
  return (
    <div>
      {compTree[CANVAS_ZONE_ROOT_ID]?.map((childAlias) => {
        if (compTree.topChildrenAlias !== undefined) {
          return (
            <ParentRenderer
              alias={childAlias}
              aliasCompMap={aliasCompMap}
              componentTreeMap={compTree}
            />
          );
        } else {
          return (
            <NormalRenderer alias={childAlias} aliasCompMap={aliasCompMap} />
          );
        }
      })}
    </div>
  );
}
