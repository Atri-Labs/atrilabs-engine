import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { Label } from "../commons/Label";
import { gray900 } from "@atrilabs/design-system";
import { PropertyContainer } from "../commons/PropertyContainer";
export const Text: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || "";
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input
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
      />
    </PropertyContainer>
  );
};
