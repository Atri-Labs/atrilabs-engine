import {
  ArrayEnumCustomProp,
  ArrayMapCustomProp,
  EnumCustomProp,
  MapCustomProp,
  SimpleCustomProp,
  TypedMapCustomProp,
  VariableKeyMapCustomProp,
} from "@atrilabs/app-design-forest/lib/customPropsTree";
import { useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { ComponentProps } from "../../types";
import { CommonPropTypeContainer } from "../commons/CommonPropTypeContainer";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

type AttributeType = {
  type:
    | SimpleCustomProp["type"]
    | MapCustomProp["type"]
    | EnumCustomProp["type"]
    | ArrayEnumCustomProp["type"]
    | ArrayMapCustomProp["type"]
    | VariableKeyMapCustomProp["type"]
    | TypedMapCustomProp["type"];
  fieldName: string;
  options?: string[];
};

export const Map: React.FC<ComponentProps> = (props) => {
  const attributes: AttributeType[] = useMemo(() => {
    return props.attributes || [];
  }, [props]);

  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const { routes } = usePageRoutes();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PropertyContainer>
        <Label name={props.propName} />
      </PropertyContainer>
      {attributes.map((attribute, index) => {
        return (
          <CommonPropTypeContainer
            {...props}
            selector={[...selector, attribute.fieldName]}
            options={attribute.options}
            propType={attribute.type}
            propName={attribute.fieldName}
            key={index}
            routes={routes}
          />
        );
      })}
    </div>
  );
};
