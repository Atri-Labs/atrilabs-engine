import { useState, useEffect } from "react";
import { componentStoreApi, canvasApi } from "../../../api";

export function useHandleNewChild(props: { id: string }) {
  const [children, setChildren] = useState<string[]>(
    componentStoreApi.getComponentChildrenId(props.id)
  );

  useEffect(() => {
    canvasApi.subscribeComponentEvent(props.id, "new_component", () => {
      setChildren(componentStoreApi.getComponentChildrenId(props.id));
    });
  }, [props.id]);

  return { children };
}
