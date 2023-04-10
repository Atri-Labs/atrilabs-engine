import { ParentComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { NormalComponentRenderer } from "../NormalComponentRenderer/NormalComponentRenderer";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useHandleNewChild } from "./hooks/useHandleNewChild";
import { useFocusComponent } from "../hooks/useFocusComponent";
import { useHasComponentRendered } from "../hooks/useHasComponentRendered";
import { RepeatingComponentRenderer } from "../RepeatingComponentRenderer/RepeatingComponentRenderer";
import { usePropsUpdated } from "../hooks/usePropsUpdated";
import { useGetComponentRef } from "../hooks/useGetComponentRef";

export function ParentComponentRenderer(props: ParentComponentRendererProps) {
  const {
    comp: Comp,
    callbacks,
    alias,
  } = componentStoreApi.getComponent(props.id)!;
  const { children } = useHandleNewChild(props);
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  useFocusComponent({ id: props.id });
  useHasComponentRendered({ id: props.id });
  const compProps = usePropsUpdated({ id: props.id });
  const ref = useGetComponentRef({ id: props.id });
  return (
    <Comp {...compProps} ref={ref} {...callbacks} className={alias}>
      {children.map((childId) => {
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
      })}
    </Comp>
  );
}
