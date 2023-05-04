import Input from "./Input";
import React from "react";

const DevInput: typeof Input = React.forwardRef((props, ref) => {
  props.custom.outerDivStyle = { display: "inline-block" };
  return <Input ref={ref} {...props} />;
});

export default DevInput;
