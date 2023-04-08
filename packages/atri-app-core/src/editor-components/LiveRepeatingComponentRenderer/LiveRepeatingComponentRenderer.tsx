import { componentStoreApi } from "../../api";
import { RepeatingComponentRendererProps } from "../../types";
import { useState, useContext } from "react";
import { LiveParentComponentRenderer } from "../LiveParentComponentRenderer/LiveParentComponentRenderer";
import { LiveNormalComponentRenderer } from "../LiveNormalComponentRenderer/LiveNormalComponentRenderer";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useGetComponentProps } from "../live-component/hooks/useGetComponentProps";
import { useGetCallbacks } from "../live-component/hooks/useGetCallbacks";
import { useGetComponentRef } from "../hooks/useGetComponentRef";
import { RepeatingContext } from "../../editor-contexts/RepeatingContext";

export function LiveRepeatingComponentRenderer(
  props: RepeatingComponentRendererProps
) {
  const { comp: Comp } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  const repeatingContext = useContext(RepeatingContext);

  const { data } = componentStoreApi.getComponentProps(props.id).custom;
  const children = componentStoreApi.getComponentChildrenId(props.id);
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  const compProps = useGetComponentProps({ id: props.id });
  const callbacks = useGetCallbacks({ id: props.id });

  let childrenNodes: React.ReactNode[] | null = null;
  if (children.length === 1 && Array.isArray(data)) {
    childrenNodes = data.map((_, index) => {
      const childId = children[0];
      const { acceptsChild, isRepeating } =
        componentStoreApi.getComponent(childId)!;
      return (
        <RepeatingContext.Provider
          value={{
            indices: [...(repeatingContext?.indices || []), index],
            lengths: [...(repeatingContext?.lengths || []), data.length],
            compIds: [...(repeatingContext?.compIds || []), props.id],
          }}
          key={childId}
        >
          {acceptsChild ? (
            isRepeating ? (
              <LiveRepeatingComponentRenderer id={childId} />
            ) : (
              <LiveParentComponentRenderer id={childId} />
            )
          ) : (
            <LiveNormalComponentRenderer id={childId} />
          )}
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
