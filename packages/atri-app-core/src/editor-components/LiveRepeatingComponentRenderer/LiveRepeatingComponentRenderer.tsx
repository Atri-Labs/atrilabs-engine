import { componentStoreApi } from "../../api";
import { RepeatingComponentRendererProps } from "../../types";
import { useState } from "react";
import { LiveParentComponentRenderer } from "../LiveParentComponentRenderer/LiveParentComponentRenderer";
import { LiveNormalComponentRenderer } from "../LiveNormalComponentRenderer/LiveNormalComponentRenderer";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";

export function LiveRepeatingComponentRenderer(
  props: RepeatingComponentRendererProps
) {
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;

  const { start, end } = componentStoreApi.getComponentProps(props.id).custom;
  const [num, setNum] = useState<number>(end - start);
  const children = componentStoreApi.getComponentChildrenId(props.id);
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  let childrenNodes: React.ReactNode[] | null = null;
  if (children.length === 1) {
    childrenNodes = Array.from(Array(num).keys()).map(() => {
      const childId = children[0];
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
    });
  }

  return (
    <Comp
      {...compProps}
      ref={ref}
      {...callbacks}
      children={childrenNodes || []}
    ></Comp>
  );
}
