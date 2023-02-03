import React, { forwardRef, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";

export const Link = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { text: string; url: string };
    onClick: () => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick();
  }, [props]);
  return (
    <div
      className={props.className}
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      onClick={onClick}
    >
      <RouterLink to={props.custom.url}>{props.custom.text}</RouterLink>
    </div>
  );
});

export default Link;
