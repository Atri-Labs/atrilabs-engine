import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Enum: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return (props.customProps[props.propName] as string) || "";
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: e.target.value,
          },
        },
      });
    },
    [props]
  );
  return (
    <PropertyContainer>
      <Label name={props.propName} />
      <select value={propValue} onChange={callPatchCb} style={{
          height: "25px",
          backgroundColor: gray900,
          border: "none",
          outline: "none",
          color: "white",
          padding: "0 4px",
          minWidth: "none",
          width: "100%",
        }}>
        {props.customProps.enumOptions.map((enumOption: string, index: number) =>
           <option value={enumOption} key={index}>{enumOption}</option> 
        )} 
      </select>
    </PropertyContainer>
  );
};
