import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";

export const Color: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return (props.customProps[props.propName] as string) || "";
  }, [props]);
  const callPatchCb = useCallback(
    (color: string) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: color,
          },
        },
      });
    },
    [props]
  );
  const onClickCb = useCallback(() => {
    props.openColorPicker({
      title: props.propName,
      value: propValue,
      onChange: callPatchCb,
    });
  }, [props, callPatchCb, propValue]);
  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <input
        value={propValue}
        onChange={(e) => {
          callPatchCb(e.target.value);
        }}
        onClick={onClickCb}
      />
    </div>
  );
};
