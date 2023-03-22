import { forwardRef } from "react";
import Cascader from "./Cascader";

const DevCascader: typeof Cascader = forwardRef((props, ref) => {
  return (
    <Cascader
      ref={ref}
      {...props}
      custom={{ ...props.custom, disabled: true }}
    />
  );
});

export default DevCascader;
