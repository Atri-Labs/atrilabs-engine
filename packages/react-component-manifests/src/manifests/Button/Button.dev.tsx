import { forwardRef } from "react";
import Button from "./Button";

const DevButton: typeof Button = forwardRef((props, ref) => {
  // props.custom.disabled = true; removed disabled as there was some issues over editor
  return (
    <Button
      ref={ref}
      {...props}
      styles={{
        ...props.styles,
        animationDuration: "0s",
        animationTimingFunction: "unset",
        transitionDuration: "0s",
        transitionTimingFunction: "unset",
      }}
    />
  );
});

export default DevButton;
