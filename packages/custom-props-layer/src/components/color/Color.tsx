import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Color: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || "";
  }, [props, selector]);

  const callPatchCb = useCallback(
    (color: string) => {
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, color),
        },
      });
    },
    [props, selector]
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
