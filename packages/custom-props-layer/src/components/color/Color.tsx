import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

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
    <PropertyContainer>
      <Label name={props.propName} />
      <input
        value={propValue}
        onChange={(e) => {
          callPatchCb(e.target.value);
        }}
        style={{
          height: "25px",
          backgroundColor: gray900,
          border: "none",
          outline: "none",
          color: "white",
          padding: "0 4px",
          minWidth: "none",
          width: "100%",
        }}
        onClick={onClickCb}
      />
    </PropertyContainer>
  );
};
