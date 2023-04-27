import {BasicProps} from "../../types";
import {Text} from "../text/Text"

export const AriaLabelledBy: React.FC<BasicProps> = (props, routes) => {

  return (
    <Text  {...props}
           selector={["aria-labelledby"]}
           propName={"aria-labelledby"}
           routes={routes}
           key={"aria-labelledby"}/>
  );
};
