import { forwardRef } from "react";
import Link from "./Link";

const DevLink: typeof Link = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Link {...props} ref={ref} />;
});

export default DevLink;
