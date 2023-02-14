import { forwardRef } from "react";
import { Countup, CountupProps } from "./CountUp";

const DevCountup = forwardRef<HTMLDivElement, CountupProps>((props, ref) => {
  return <Countup ref={ref} {...props} />;
});

export default DevCountup;
