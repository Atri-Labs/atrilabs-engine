import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { PropertyContainer } from "../commons/PropertyContainer";
import { Label } from "../commons/Label";
import { gray900 } from "@atrilabs/design-system";
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
      <input
        value={propValue}
        onChange={callPatchCb}
        type={"number"}
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
      />
    </PropertyContainer>
  );
};
