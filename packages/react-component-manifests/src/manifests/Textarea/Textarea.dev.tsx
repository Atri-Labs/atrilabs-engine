import Textarea from "./Textarea";
import React from "react";

const DevTextarea: typeof Textarea = React.forwardRef((props, ref) => {
  props.custom.outerDivStyle = { display: "inline-block" };
  return <Textarea ref={ref} {...props} />;
});

export default DevTextarea;
