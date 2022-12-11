import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { PropertyContainer } from "../commons/PropertyContainer";
import { Label } from "../commons/Label";
import { NumberInput } from "../commons/NumberInput";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const Number: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || 0;
  }, [props, selector]);

  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.patchCb({
        property: {
          custom: createObject(
            props.customProps,
            selector,
            e.target.value ? parseFloat(e.target.value) : ""
          ),
        },
      });
    },
    [props, selector]
  );

  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <NumberInput value={propValue} onChange={callPatchCb} />
    </PropertyContainer>
  );
};
