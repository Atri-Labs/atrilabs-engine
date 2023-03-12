import { DecoratorData } from "../../types";
import { useEffect } from "react";
import { useGetComponentRef } from "./useGetComponentRef";

export function useAssignComponentId(props: DecoratorData) {
  const ref = useGetComponentRef(props);
  useEffect(() => {
    ref.current?.setAttribute("data-atri-comp-id", props.id);
  }, [props.id, ref]);
}
