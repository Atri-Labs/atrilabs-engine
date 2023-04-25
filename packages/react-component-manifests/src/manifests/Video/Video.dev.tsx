import { forwardRef } from "react";
import Video from "./Video";
import { gray500 } from "@atrilabs/design-system";

const DevVideo: typeof Video = forwardRef((props, ref) => {
  const overrideStyleProps: React.CSSProperties =
    props.custom.url === undefined
      ? {
          // do not provide minHeight minWidth if user has provided height width
          height: props.styles.height ? props.styles.height : "350px",
          width: props.styles.width ? props.styles.width : "350px",
          borderWidth: `2px`,
          borderStyle: `dashed`,
          borderColor: `${gray500}`,
          boxSizing: "border-box",
          ...props.styles,
        }
      : { ...props.styles };
  return (
    <Video
      ref={ref}
      {...props}
      styles={overrideStyleProps}
      className={props.className}
    />
  );
});

export default DevVideo;
