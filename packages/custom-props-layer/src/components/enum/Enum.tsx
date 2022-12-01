import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Enum: React.FC<ComponentProps> = (props) => {
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
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, e.target.value),
        },
      });
    },
    [props, selector]
  );

  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <select
        value={propValue}
        onChange={callPatchCb}
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
      >
        {props.options!.map((option: string, index: number) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
      </select>
    </PropertyContainer>
  );
};
