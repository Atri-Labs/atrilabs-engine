import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { Checkbox } from "../commons/Checkbox";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Boolean: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || false;
  }, [props]);
  const callPatchCb = useCallback(
    (value: boolean) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: value,
          },
        },
      });
    },
    [props]
  );
  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <Checkbox onChange={callPatchCb} value={propValue} />
    </PropertyContainer>
  );
};
