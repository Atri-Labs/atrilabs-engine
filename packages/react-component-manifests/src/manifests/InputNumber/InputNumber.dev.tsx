import InputNumber from "./InputNumber";
import React from "react";

const DevInputNumber: typeof InputNumber = React.forwardRef((props, ref) => {
  props.custom.outerDivStyle = { display: "inline-block" };
  return <InputNumber ref={ref} {...props} />;
});

export default DevInputNumber;
