import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { PropertyContainer } from "../commons/PropertyContainer";
import { Label } from "../commons/Label";
import { NumberInput } from "../commons/NumberInput";
export const Number: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || "";
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: e.target.value ? parseFloat(e.target.value) : "",
          },
        },
      });
    },
    [props]
  );
  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <NumberInput value={propValue} onChange={callPatchCb} />
    </PropertyContainer>
  );
};
