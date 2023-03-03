import { useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { AttributeType, ComponentProps } from "../../types";
import { CommonPropTypeContainer } from "../commons/CommonPropTypeContainer";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

/*
  map custom prop is used in cases where a component needs an object datatype
  Example: Person with attributes fName, lName and age.
  person: {
    type: "map",
    attributes: [
      { fieldName: "fName", type: "text" },
      { fieldName: "lName", type: "text" },
      { fieldName: "age", type: "number" },
    ],
  }
*/

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
