import {BasicProps} from "../../types";
import {Text} from "../text/Text"

export const Basics: React.FC<BasicProps> = (props, routes) => {

  return (
    <Text {...props}
          selector={["class"]}
          propName={"class"}
          routes={routes}
          key={"class"}/>
  );
};
