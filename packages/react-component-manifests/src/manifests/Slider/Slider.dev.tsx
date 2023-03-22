import { forwardRef } from "react";
import Slider from "./Slider";

const DevSlider: typeof Slider = forwardRef((props, ref) => {
  return (
    <Slider ref={ref} {...props} custom={{ ...props.custom, disabled: true }} />
  );
});

export default DevSlider;
