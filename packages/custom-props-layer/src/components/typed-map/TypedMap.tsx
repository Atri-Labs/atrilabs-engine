import { gray900 } from "@atrilabs/design-system";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
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

const getInitialValue = (attribute: any) => {
  const stringType = [
    "text",
    "large_text",
    "static_asset",
    "color",
    "internal_link",
    "external_link",
    "enum",
  ];
  const numberType = ["number", "array_number"];
  const booleanType = ["boolean", "array_boolean"];
  const mapType = ["map", "array_map"];
  if (stringType.indexOf(attribute.type) !== -1) {
    return "";
  } else if (numberType.indexOf(attribute.type) !== -1) {
    return 0;
  } else if (booleanType.indexOf(attribute.type) !== -1) {
    return false;
  } else if (mapType.indexOf(attribute.type) !== -1) {
    return {};
  } else {
    return [];
  }
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
    }
    return currentValue["selectedOption"] || "none";
  }, [props, selector]);

  const options = useMemo(() => {
    const options = props.attributes!.map((attribute) => attribute.fieldName);
    options.push("none");
    return options;
  }, [props.attributes]);

  const attribute = useMemo(() => {
    const idx = findIndex(options, propValue);
    if (idx === options.length - 1) return "";
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
      props.patchCb({
        property: {
          custom: createObject(
            props.customProps,
            [...selector, "property"],
            e.target.value !== "none"
              ? getInitialValue(
                  props.attributes![findIndex(options, e.target.value)]
                )
              : ""
          ),
        },
      });
    },
    [options, props, selector]
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
      {attribute && attribute.type === "map" && (
        <MapContainer
          {...props}
          selector={[...selector, "property", attribute.fieldName]}
          attributes={attribute.attributes}
          propType={attribute.type}
          propName={attribute.fieldName}
          key={attribute.fieldName}
          routes={routes}
        />
      )}
      {attribute && (
        <CommonPropTypeContainer
          {...props}
          selector={[...selector, "property"]}
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
