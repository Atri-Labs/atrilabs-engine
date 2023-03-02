import React, { forwardRef, useCallback } from "react";

export const Anchor = forwardRef<
  HTMLAnchorElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    onClick: (event: {
      eventX: number;
      eventY: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClickCb = useCallback(
    (e: React.MouseEvent) => {
      const { x, y, width, height } = (
        e.nativeEvent.target as HTMLElement
      ).getBoundingClientRect();
      props.onClick({
        eventX: e.pageX,
        eventY: e.pageY,
        x,
        y,
        width,
        height,
      });
    },
    [props]
  );
  return (
    <a
      ref={ref}
      style={props.styles}
      onClick={onClickCb}
      className={props.className}
    > 
      {props.children}
    </a>
  );
});

export default Anchor;
