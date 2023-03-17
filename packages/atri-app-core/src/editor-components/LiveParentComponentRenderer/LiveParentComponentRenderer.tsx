import { ParentComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { LiveRepeatingComponentRenderer } from "../LiveRepeatingComponentRenderer/LiveRepeatingComponentRenderer";
import { LiveNormalComponentRenderer } from "../LiveNormalComponentRenderer/LiveNormalComponentRenderer";
import { useGetComponentProps } from "../live-component/hooks/useGetComponentProps";
import { useGetCallbacks } from "../live-component/hooks/useGetCallbacks";
import { useGetComponentRef } from "../hooks/useGetComponentRef";

export function LiveParentComponentRenderer(
  props: ParentComponentRendererProps
) {
  const { comp: Comp } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  const children = componentStoreApi.getComponentChildrenId(props.id);
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  const compProps = useGetComponentProps({ id: props.id });
  const callbacks = useGetCallbacks({ id: props.id });
  return (
    <Comp {...compProps} ref={ref} {...callbacks}>
      {children.map((childId) => {
        const { acceptsChild, isRepeating } =
          componentStoreApi.getComponent(childId)!;
        return acceptsChild ? (
          isRepeating ? (
            <LiveRepeatingComponentRenderer id={childId} key={childId} />
          ) : (
            <LiveParentComponentRenderer id={childId} key={childId} />
          )
        ) : (
          <LiveNormalComponentRenderer id={childId} key={childId} />
        );
      })}
    </Comp>
  );
}
