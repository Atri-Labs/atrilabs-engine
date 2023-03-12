import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useFocusComponent } from "../hooks/useFocusComponent";
import { useHasComponentRendered } from "../hooks/useHasComponentRendered";
import { usePropsUpdated } from "../hooks/usePropsUpdated";
import { useGetComponentRef } from "../hooks/useGetComponentRef";

export function NormalComponentRenderer(props: NormalComponentRendererProps) {
  const {
    comp: Comp,
    props: compProps,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  useAssignComponentId({ id: props.id });
  useFocusComponent({ id: props.id });
  useHasComponentRendered({ id: props.id });
  usePropsUpdated({ id: props.id });
  return <Comp {...compProps} ref={ref} {...callbacks} />;
}
