import Form from "./Form";
import React from "react";

const DevForm: typeof Form = React.forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Form ref={ref} {...props} />;
});

export default DevForm;
