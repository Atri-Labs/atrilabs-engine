import { forwardRef } from "react";
import TimePicker from "./TimePicker";

const DevTimePicker: typeof TimePicker = forwardRef((props, ref) => {
  //props.custom.disabled = true;
  return <TimePicker ref={ref} {...props} />;
});

export default DevTimePicker;
