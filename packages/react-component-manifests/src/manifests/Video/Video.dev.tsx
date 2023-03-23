import { forwardRef } from "react";
import Video from "./Video";
import { gray500 } from "@atrilabs/design-system";

const DevVideo: typeof Video = forwardRef((props, ref) => {
  const overrideStyleProps: React.CSSProperties =
     props.custom.url === undefined
      ? {
          // do not provide minHeight minWidth if user has provided height width
          minHeight: props.styles.height ? "" : "100px",
          minWidth: props.styles.width ? "" : "100px",
          borderWidth: `2px`,
          borderStyle: `dashed`,
          borderColor: `${gray500}`,
          boxSizing: "border-box",
          display: "inline-block",
          ...props.styles,
        }
      : { ...props.styles };
  return (
    <Video
      ref={ref}
      {...props}
      styles={overrideStyleProps}
    />
  );
});

export default DevVideo;
