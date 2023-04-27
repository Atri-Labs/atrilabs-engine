import React, { forwardRef, useCallback } from "react";

const Icon = forwardRef<
  HTMLElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    custom: { svg: string };
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
  const onClick = useCallback(
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
    <i
      ref={ref}
      id={props.attrs.id}
      className={`${props.className} ${props.attrs.class}`}
      style={props.styles}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: props.custom.svg }}
    />
  );
});

export default Icon;
