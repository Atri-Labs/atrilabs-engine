import React, { forwardRef, useCallback } from "react";

export const TextBox = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    custom: { text: string };
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
    <div
      ref={ref}
      className={`${props.className} ${props.attrs?.class}`}
      style={props.styles}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: props.custom.text }}
      id={props.id}
    />
  );
});

export default TextBox;
