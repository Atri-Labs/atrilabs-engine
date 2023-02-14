import { forwardRef } from "react";
import { Upload } from "./Upload";

const DevUpload: typeof Upload = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Upload {...props} ref={ref} />;
});

export default DevUpload;
