import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignComponentId } from "../hooks/useAssignComponentId";

export function NormalComponentRenderer(props: NormalComponentRendererProps) {
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  useAssignComponentId({ id: props.id });
  return <Comp {...compProps} ref={ref} {...callbacks} />;
}
