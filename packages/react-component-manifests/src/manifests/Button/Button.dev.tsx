import { forwardRef } from "react";
import Button from "./Button";

const DevButton: typeof Button = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Button ref={ref} {...props} />;
});

export default DevButton;
