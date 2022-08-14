import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const InternalLink: React.FC<ComponentProps> = (props) => {
  const propValue: string = useMemo(() => {
    return props.customProps[props.propName] || "";
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
      <select
        value={propValue}
        onChange={callPatchCb}
        style={{
          height: "25px",
          backgroundColor: gray900,
          border: "none",
          outline: "none",
          color: "white",
        }}
      >
        {props.routes.map((value) => {
          return (
            <option value={value} key={value}>
              {value}
            </option>
          );
        })}
      </select>
    </PropertyContainer>
  );
};
