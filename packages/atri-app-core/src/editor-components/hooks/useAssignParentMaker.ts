import { DecoratorData } from "../../types";
import { useEffect } from "react";
import { useGetComponentRef } from "./useGetComponentRef";

export function useAssignParentMarker(props: DecoratorData) {
  const ref = useGetComponentRef(props);
  useEffect(() => {
    ref.current?.setAttribute("data-atri-parent", "");
  }, [props.id, ref]);
}
