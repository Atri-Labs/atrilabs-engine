import React, { forwardRef, useCallback } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  {
    styles: React.CSSProperties;
    custom: { text: string };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  return (
    <button
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      {props.custom.text}
    </button>
  );
});

export default Button;
