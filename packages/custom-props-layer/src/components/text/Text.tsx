import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";
import { TextInput } from "../commons/TextInput";

export const Text: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);
  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
    }
    return currentValue || "";
  }, [props, selector]);

  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const createObject = (fields: string[], value: string) => {
        const reducer: any = (
          acc: string,
          item: string,
          index: number,
          arr: string[]
        ) => ({
          [item]: index + 1 < arr.length ? acc : value,
        });
        return fields.reduceRight(reducer, {});
      };
      props.patchCb({
        property: {
          custom: createObject(selector, e.target.value),
        },
      });
    },
    [props, selector]
  );
  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <TextInput value={propValue} onChange={callPatchCb} />
    </PropertyContainer>
  );
};
