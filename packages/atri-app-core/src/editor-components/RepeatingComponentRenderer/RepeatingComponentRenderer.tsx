import { componentStoreApi } from "../../api";
import { RepeatingComponentRendererProps } from "../../types";
import { useState } from "react";
import { useHandleNewChild } from "../ParentComponentRenderer/hooks/useHandleNewChild";
import { ParentComponentRenderer } from "../ParentComponentRenderer/ParentComponentRenderer";
import { NormalComponentRenderer } from "../NormalComponentRenderer/NormalComponentRenderer";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useFocusComponent } from "../hooks/useFocusComponent";
import { useHasComponentRendered } from "../hooks/useHasComponentRendered";

export function RepeatingComponentRenderer(
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
  const { children } = useHandleNewChild({ id: props.id });
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  useFocusComponent({ id: props.id });
  useHasComponentRendered({ id: props.id });
  let childrenNodes: React.ReactNode[] | null = null;
  if (children.length === 1) {
    childrenNodes = Array.from(Array(num).keys()).map(() => {
      const childId = children[0];
      const { acceptsChild, isRepeating } =
        componentStoreApi.getComponent(childId)!;
      return acceptsChild ? (
        isRepeating ? (
          <RepeatingComponentRenderer id={childId} key={childId} />
        ) : (
          <ParentComponentRenderer id={childId} key={childId} />
        )
      ) : (
        <NormalComponentRenderer id={childId} key={childId} />
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
