import Search from "./Search";
import React from "react";

const DevSearch: typeof Search = React.forwardRef((props, ref) => {
  props.custom.outerDivStyle = { display: "inline-block" };
  return <Search ref={ref} {...props} />;
});

export default DevSearch;
