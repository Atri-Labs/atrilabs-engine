import { forwardRef } from "react";
import { Countdown, CountdownProps } from "./Countdown";

const DevCountdown = forwardRef<HTMLDivElement, CountdownProps>(
  (props, ref) => {
    props.custom.frozen = true;
    return <Countdown ref={ref} {...props} />;
  }
);

export default DevCountdown;
