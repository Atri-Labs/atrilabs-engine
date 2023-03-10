import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useGetComponentProps } from "../live-component/hooks/useGetComponentProps";
import { useGetCallbacks } from "../live-component/hooks/useGetCallbacks";

export function LiveNormalComponentRenderer(
  props: NormalComponentRendererProps
) {
  const { comp: Comp, ref } = componentStoreApi.getComponent(props.id)!;
  useAssignComponentId({ id: props.id });
  const compProps = useGetComponentProps({ id: props.id });
  const callbacks = useGetCallbacks({ id: props.id });
  return <Comp {...compProps} ref={ref} {...callbacks} />;
}
