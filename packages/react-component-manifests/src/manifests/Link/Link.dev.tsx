import { forwardRef, useCallback } from "react";

const DevLink = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { text: string; url: string };
    onClick: () => void;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick();
  }, [props]);
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      onClick={onClick}
    >
      {props.custom.text}
    </div>
  );
});

export default DevLink;
