import React, { forwardRef, useCallback } from "react";

const Image = forwardRef<
  HTMLImageElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: { alt: string; src: string };
    onClick: (event: {
      eventX: number;
      eventY: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void;
    id?: string;
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
    <img
      className={props.className}
      ref={ref}
      style={props.styles}
      onClick={onClick}
      src={props.custom.src}
      alt={props.custom.alt}
      id={props.id}
    />
  );
});

export default Image;
