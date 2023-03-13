import { forwardRef } from "react";
import Select from "./Select";

const DevSelect: typeof Select = forwardRef((props, ref) => {
  return (
    <Select ref={ref} {...props} custom={{ ...props.custom, disabled: true }} />
  );
});

export default DevSelect;
