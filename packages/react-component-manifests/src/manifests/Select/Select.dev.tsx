import { forwardRef } from "react";
import Select from "./Select";
import { gray500 } from "@atrilabs/design-system";

const DevSelect: typeof Select = forwardRef((props, ref) => {

  return <Select ref={ref} {...props} custom={{...props.custom, disabled: true}} />;
});

export default DevSelect;
