import { forwardRef } from "react";
import Breadcrumb from "./Breadcrumb";

const DevBreadcrumb: typeof Breadcrumb = forwardRef((props, ref) => {
  props.custom.items.forEach((item) => {
    // eslint-disable-next-line no-script-url
    item.href = "javascript:void(0)";
  });
  return <Breadcrumb ref={ref} {...props} />;
});

export default DevBreadcrumb;
