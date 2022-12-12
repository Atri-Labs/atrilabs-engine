import { useCallback, useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { AttributeType, ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { CommonPropTypeContainer } from "../commons/CommonPropTypeContainer";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";
import { RearrangeListWrapper } from "../commons/RearrangeListWrapper";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";

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

  const singleObjectName = useMemo(() => {
    return props.singleObjectName || "";
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || [];
  }, [props, selector]);
  const attributes: AttributeType[] = useMemo(() => {
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

  const deleteValueCb = useCallback(
    (index: number) => {
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, updatedValue),
        },
      });
    },
    [propValue, props, selector]
  );

  const onReposition = useCallback(
    (deleteAt: number, insertAt: number) => {
      const updatedValue = [...propValue];
      const deletedItem = updatedValue.splice(deleteAt, 1)[0];
      updatedValue.splice(insertAt, 0, deletedItem);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, updatedValue),
        },
      });
    },
    [propValue, props, selector]
  );

  const { routes } = usePageRoutes();

  return (
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={insertValueCb} name={props.propName} />
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: "0.5em" }}
      >
        {Array.isArray(propValue) ? (
          <RearrangeListWrapper
            onReposition={onReposition}
            onMinusClick={deleteValueCb}
            minusButton={false}
          >
            {propValue.map((value, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "1px solid #fff",
                  }}
                  key={index}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <PropertyContainer>
                      <Label name={singleObjectName} />
                    </PropertyContainer>
                    <div
                      onClick={() => {
                        deleteValueCb(index);
                      }}
                    >
                      <MinusIcon />
                    </div>
                  </div>
                  <div>
                    {attributes.map((attribute) => {
                      return (
                        <CommonPropTypeContainer
                          {...props}
                          selector={[...selector, index, attribute.fieldName]}
                          options={attribute.options}
                          propType={attribute.type}
                          propName={attribute.fieldName}
                          key={attribute.fieldName}
                          routes={routes}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </RearrangeListWrapper>
        ) : null}
      </div>
    </ArrayPropertyContainer>
  );
};
