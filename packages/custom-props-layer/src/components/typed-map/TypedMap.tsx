import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { AttributeType, ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { CommonPropTypeContainer } from "../commons/CommonPropTypeContainer";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { MapContainer } from "../commons/MapContainer";

const findIndex = (options: string[], key: string) => {
  for (let i = 0; i < options.length; i++) {
    if (options[i] === key) return i;
  }
  return -1;
};

export const TypedMap: React.FC<ComponentProps> = (props) => {
  const { routes } = usePageRoutes();

  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue["selectedOption"] || "none";
  }, [props, selector]);

  const options = useMemo(() => {
    const options = props.attributes!.map((attribute) => attribute.fieldName);
    options.push("none");
    return options;
  }, [props.attributes]);

  const attribute: AttributeType = useMemo(() => {
    const idx = findIndex(options, propValue);
    if (idx === options.length - 1) return { type: "none", fieldName: "" };
    return props.attributes![idx];
  }, [options, propValue, props.attributes]);

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
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {attribute.type === "map" || attribute.type === "array_map" ? (
        <MapContainer
          {...props}
          selector={[...selector, attribute.fieldName]}
          attributes={attribute.attributes}
          propType={attribute.type}
          propName={attribute.fieldName}
          key={attribute.fieldName}
          routes={routes}
        />
      ) : (
        <CommonPropTypeContainer
          {...props}
          selector={[...selector, attribute.fieldName]}
          options={attribute.options}
          propType={attribute.type}
          propName={attribute.fieldName}
          key={attribute.fieldName}
          routes={routes}
        />
      )}
    </div>
  );
};
