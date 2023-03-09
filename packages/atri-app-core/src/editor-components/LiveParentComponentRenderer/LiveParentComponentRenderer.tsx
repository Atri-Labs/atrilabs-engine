import { ParentComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { LiveRepeatingComponentRenderer } from "../LiveRepeatingComponentRenderer/LiveRepeatingComponentRenderer";
import { LiveNormalComponentRenderer } from "../LiveNormalComponentRenderer/LiveNormalComponentRenderer";

export function LiveParentComponentRenderer(
  props: ParentComponentRendererProps
) {
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  const children = componentStoreApi.getComponentChildrenId(props.id);
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
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
