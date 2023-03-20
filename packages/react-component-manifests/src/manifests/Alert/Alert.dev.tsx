import { forwardRef } from "react";
import Alert from "./Alert";

const DevAlert: typeof Alert = forwardRef((props, ref) => {
  props.custom.isClosable = false;
  return <Alert ref={ref} {...props} />;
});

export default DevAlert;
