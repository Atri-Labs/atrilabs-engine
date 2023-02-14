import { DecoratorData } from "../../types";
import { componentStoreApi } from "../../api/componentStoreApi";
import { useEffect } from "react";

export function useAssignParentMarker(props: DecoratorData) {
  useEffect(() => {
    const ref = componentStoreApi.getComponentRef(props.id);
    ref.current?.setAttribute("data-atri-parent", "");
  }, [props.id]);
}
