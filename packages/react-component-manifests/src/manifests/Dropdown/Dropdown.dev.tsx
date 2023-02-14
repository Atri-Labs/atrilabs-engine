import { forwardRef } from "react";
import Dropdown from "./Dropdown";

const DevDropdown: typeof Dropdown = forwardRef((props, ref) => {
  return <Dropdown {...props} ref={ref} />;
});

export default DevDropdown;
