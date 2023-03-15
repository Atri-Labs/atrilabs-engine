import { forwardRef } from "react";
import Carousel from "./Carousel";

const DevCarousel: typeof Carousel = forwardRef((props, ref) => {
  props.custom.dots = false;
  return <Carousel ref={ref} {...props} />;
});

export default DevCarousel;
