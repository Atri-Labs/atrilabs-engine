import { forwardRef } from "react";
import Checkbox from "./Checkbox";

const DevCheckbox: typeof Checkbox = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Checkbox ref={ref} {...props} />;
});
export default DevCheckbox;
