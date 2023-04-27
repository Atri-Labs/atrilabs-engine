import React, { forwardRef, useCallback } from "react";

export const Flex = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
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
    <div
      ref={ref}
      style={props.styles}
      onClick={onClickCb}
      className={`${props.className} ${props.attrs.class}`}
      id={props.attrs.id}
    >
      {props.children}
    </div>
  );
});

export default Flex;
