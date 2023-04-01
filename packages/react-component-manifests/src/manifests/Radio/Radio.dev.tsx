import { forwardRef } from "react";
import Radio from "./Radio";

const DevRadio: typeof Radio = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Radio ref={ref} {...props} />;
});
export default DevRadio;
