import { forwardRef } from "react";
import Menu from "./Menu";

const DevMenu: typeof Menu = forwardRef((props, ref) => {
  props.custom.items.forEach((item) => {
    item.disabled = true;
  });
  return <Menu ref={ref} {...props} />;
});
export default DevMenu;
