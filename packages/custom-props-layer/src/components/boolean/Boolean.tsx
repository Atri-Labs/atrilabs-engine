import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Boolean: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || false;
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: e.target.checked,
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
        onChange={callPatchCb}
        type="checkbox"
        checked={propValue}
        style={{
          height: "25px",
          width: "20px",
          accentColor: gray900,
          border: "none",
          outline: "none",
          padding: 0,
          margin: 0,
        }}
      />
    </PropertyContainer>
  );
};
