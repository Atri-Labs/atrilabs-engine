import React, { forwardRef } from "react";
import Drawer from "./Drawer";

const DevDrawer: typeof Drawer = forwardRef((props, ref) => {
  const divStyleProps: React.CSSProperties =
    props.custom.open === true
      ? {
          height: "20vh",
          width: "100vw",
          borderWidth: `2px`,
          borderColor: `gray`,
          borderStyle: `dashed`,
          boxSizing: "border-box",
          display: "inline-block",
        }
      : {};

  return (
    <div ref={ref} style={divStyleProps}>
      <Drawer ref={ref} {...props} custom={{ ...props.custom, mask: false }} />
    </div>
  );
});
export default DevDrawer;
