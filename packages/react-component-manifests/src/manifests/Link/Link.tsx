import React, { forwardRef, useCallback } from "react";
import { default as AtriLink } from "@atrilabs/atri-app-core/src/components/Link";

export const Link = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { text: string; url: string; disabled?: boolean };
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
      <AtriLink
        href={props.custom.url}
        disabled={props.custom.disabled}
        styles={props.styles}
      >
        {props.custom.text}
      </AtriLink>
    </div>
  );
});

export default Link;
