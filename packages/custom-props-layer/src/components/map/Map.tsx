import { ComponentProps } from "../../types";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";
import { Text } from "../text/Text";
import { usePageRoutes } from "../../hooks/usePageRoutes";

export const Map: React.FC<ComponentProps> = (props) => {
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
      {props.attributes!.map((attribute, index) => {
        if (attribute.type === "text") {
          return (
            <Text
              {...props}
              propName={attribute.name}
              key={attribute.name}
              objectName={props.propName}
              routes={routes}
            />
          );
        }
      })}
    </div>
  );
};
