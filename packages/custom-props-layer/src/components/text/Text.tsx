import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";
import { TextInput } from "../commons/TextInput";

export const Text: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    if (props.objectName)
      return props.customProps[props.objectName][props.propName] || "";
    return props.customProps[props.propName] || "";
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.objectName) {
        props.patchCb({
          property: {
            custom: {
              [props.objectName]: {
                [props.propName]: e.target.value,
              },
            },
          },
        });
      } else {
        props.patchCb({
          property: {
            custom: {
              [props.propName]: e.target.value,
            },
          },
        });
      }
    },
    [props]
  );
  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <TextInput value={propValue} onChange={callPatchCb} />
    </PropertyContainer>
  );
};
