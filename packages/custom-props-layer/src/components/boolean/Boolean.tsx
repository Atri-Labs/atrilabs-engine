import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { Checkbox } from "../commons/Checkbox";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Boolean: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || false;
  }, [props, selector]);

  const callPatchCb = useCallback(
    (value: boolean) => {
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, value),
        },
      });
    },
    [props, selector]
  );

  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <Checkbox onChange={callPatchCb} value={propValue} />
    </PropertyContainer>
  );
};
