import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useGetComponentProps } from "../live-component/hooks/useGetComponentProps";
import { useGetCallbacks } from "../live-component/hooks/useGetCallbacks";
import { useGetComponentRef } from "../hooks/useGetComponentRef";

export function LiveNormalComponentRenderer(
  props: NormalComponentRendererProps
) {
  const { comp: Comp, alias } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  useAssignComponentId({ id: props.id });
  const compProps = useGetComponentProps({ id: props.id });
  const callbacks = useGetCallbacks({ id: props.id });
  return <Comp {...compProps} ref={ref} {...callbacks} className={alias} />;
}
