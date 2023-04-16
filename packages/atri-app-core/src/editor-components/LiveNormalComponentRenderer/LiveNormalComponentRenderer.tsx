import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { useGetComponentProps } from "../live-component/hooks/useGetComponentProps";
import { useGetCallbacks } from "../live-component/hooks/useGetCallbacks";
import { useGetComponentRef } from "../hooks/useGetComponentRef";
import { useStyleString } from "../hooks/useStyleString";

export function LiveNormalComponentRenderer(
  props: NormalComponentRendererProps
) {
  const { comp: Comp, alias } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  useAssignComponentId({ id: props.id });
  const compProps = useGetComponentProps({ id: props.id });
  const { styleStr, styles } = useStyleString({ alias, compProps });
  const callbacks = useGetCallbacks({ id: props.id });
  return (
    <>
      <style>{styleStr}</style>
      <Comp
        {...{ ...compProps, styles }}
        ref={ref}
        {...callbacks}
        className={alias}
      />
    </>
  );
}
