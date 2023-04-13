import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useFocusComponent } from "../hooks/useFocusComponent";
import { useHasComponentRendered } from "../hooks/useHasComponentRendered";
import { usePropsUpdated } from "../hooks/usePropsUpdated";
import { useGetComponentRef } from "../hooks/useGetComponentRef";
import { useStyleString } from "../hooks/useStyleString";

export function NormalComponentRenderer(props: NormalComponentRendererProps) {
  const {
    comp: Comp,
    callbacks,
    alias,
  } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  useAssignComponentId({ id: props.id });
  useFocusComponent({ id: props.id });
  useHasComponentRendered({ id: props.id });
  const compProps = usePropsUpdated({ id: props.id });
  const styleStr = useStyleString({ alias, compProps });
  return (
    <>
      <style>{styleStr}</style>
      <Comp
        {...{ ...compProps, styles: {} }}
        ref={ref}
        {...callbacks}
        className={alias}
      />
    </>
  );
}
