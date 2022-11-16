import { useCallback, useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { ComponentProps } from "../../types";
import { createObject } from "../../utility/Utility";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { CommonPropTypeContainer } from "../commons/CommonPropTypeContainer";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

const createMapObject = (attributes: { fieldName: string; type: string }[]) => {
  const obj: any = {};
  const stringType = [
    "text",
    "array",
    "large_text",
    "static_asset",
    "color",
    "array_static_asset",
    "internal_link",
    "external_link",
    "enum",
    "array_enum",
  ];
  const numberType = ["number", "array_number"];
  const booleanType = ["boolean", "array_boolean"];
  for (let attribute of attributes) {
    if (stringType.indexOf(attribute.type) !== -1) {
      obj[attribute.fieldName] = "";
    } else if (numberType.indexOf(attribute.type) !== -1) {
      obj[attribute.fieldName] = 0;
    } else if (booleanType.indexOf(attribute.type) !== -1) {
      obj[attribute.fieldName] = false;
    } else {
      obj[attribute.fieldName] = {};
    }
  }
  return obj;
};

export const MapList: React.FC<ComponentProps> = (props) => {
  const selector: (string | number)[] = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
    }
    return currentValue || [];
  }, [props, selector]);

  const attributes = useMemo(() => {
    return props.attributes || [];
  }, [props]);

  const insertValueCb = useCallback(() => {
    props.patchCb({
      property: {
        custom: createObject(
          props.customProps,
          selector,
          propValue.concat(createMapObject(attributes))
        ),
      },
    });
  }, [props, selector, propValue, attributes]);

  const { routes } = usePageRoutes();

  return (
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={insertValueCb} name={props.propName} />
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: "0.5em" }}
      >
        {Array.isArray(propValue)
          ? propValue.map((value, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  key={index}
                >
                  <PropertyContainer>
                    <Label name={index.toString()} />
                  </PropertyContainer>
                  {attributes.map((attribute) => {
                    return (
                      <CommonPropTypeContainer
                        {...props}
                        selector={[props.propName, index, attribute.fieldName]}
                        options={attribute.options}
                        propType={attribute.type}
                        propName={attribute.fieldName}
                        key={attribute.fieldName}
                        routes={routes}
                      />
                    );
                  })}
                </div>
              );
            })
          : null}
      </div>
    </ArrayPropertyContainer>
  );
};
