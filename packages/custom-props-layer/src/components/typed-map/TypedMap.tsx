import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const TypedMap: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);
  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
    }
    return currentValue["selectedOption"] || "";
  }, [props, selector]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.patchCb({
        property: {
          custom: createObject(
            props.customProps,
            [...selector, "selectedOption"],
            e.target.value
          ),
        },
      });
    },
    [props, selector]
  );

  return (
    <div>
      <div
        style={{ color: "white", paddingBottom: "12px" }}
      >{`Add a property to ${props.propName}`}</div>
      <select
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
      >
        {props.attributes!.map((attribute, index) => (
          <option value={attribute.fieldName} key={index}>
            {attribute.fieldName}
          </option>
        ))}
      </select>
    </div>
  );
};
