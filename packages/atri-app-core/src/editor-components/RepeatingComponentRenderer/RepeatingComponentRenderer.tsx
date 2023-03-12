import { componentStoreApi } from "../../api";
import { RepeatingComponentRendererProps } from "../../types";
import { useState, useContext } from "react";
import { useHandleNewChild } from "../ParentComponentRenderer/hooks/useHandleNewChild";
import { ParentComponentRenderer } from "../ParentComponentRenderer/ParentComponentRenderer";
import { NormalComponentRenderer } from "../NormalComponentRenderer/NormalComponentRenderer";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useFocusComponent } from "../hooks/useFocusComponent";
import { useHasComponentRendered } from "../hooks/useHasComponentRendered";
import { usePropsUpdated } from "../hooks/usePropsUpdated";
import { RepeatingContext } from "../../editor-contexts/RepeatingContext";
import { useGetComponentRef } from "../hooks/useGetComponentRef";

export function RepeatingComponentRenderer(
  props: RepeatingComponentRendererProps
) {
  const {
    comp: Comp,
    props: compProps,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });

  const { start, end } = componentStoreApi.getComponentProps(props.id).custom;
  const [num, setNum] = useState<number>(end - start);
  const { children } = useHandleNewChild({ id: props.id });
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  useFocusComponent({ id: props.id });
  useHasComponentRendered({ id: props.id });
  usePropsUpdated({ id: props.id });
  const repeatingContext = useContext(RepeatingContext);
  let childrenNodes: React.ReactNode[] | null = null;
  if (children.length === 1) {
    childrenNodes = Array.from(Array(num).keys()).map((_, index) => {
      const childId = children[0];
      const { acceptsChild, isRepeating } =
        componentStoreApi.getComponent(childId)!;
      return acceptsChild ? (
        isRepeating ? (
          <RepeatingContext.Provider
            value={{
              indices: [...(repeatingContext?.indices || []), index],
              lengths: [...(repeatingContext?.lengths || []), num],
            }}
            key={childId}
          >
            <RepeatingComponentRenderer id={childId} />
          </RepeatingContext.Provider>
        ) : (
          <RepeatingContext.Provider
            value={{
              indices: [...(repeatingContext?.indices || []), index],
              lengths: [...(repeatingContext?.lengths || []), num],
            }}
            key={childId}
          >
            <ParentComponentRenderer id={childId} />
          </RepeatingContext.Provider>
        )
      ) : (
        <RepeatingContext.Provider
          value={{
            indices: [...(repeatingContext?.indices || []), index],
            lengths: [...(repeatingContext?.lengths || []), num],
          }}
          key={childId}
        >
          <NormalComponentRenderer id={childId} />
        </RepeatingContext.Provider>
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
