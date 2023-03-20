import { forwardRef } from "react";
import DatePicker from "./DatePicker";

const DevDatePicker: typeof DatePicker = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <DatePicker ref={ref} {...props} />;
});

export default DevDatePicker;
