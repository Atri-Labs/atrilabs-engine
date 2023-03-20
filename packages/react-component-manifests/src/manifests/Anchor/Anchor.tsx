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
    custom: {
      href: string | undefined;
      download: string | undefined;
      referrerPolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
      rel:
        | "alternate"
        | "author"
        | "bookmark"
        | "external"
        | "help"
        | "license"
        | "next"
        | "nofollow"
        | "noreferrer"
        | "noopener"
        | "prev"
        | "search"
        | "tag";
      target: "_blank" | "_parent" | "_self" | "_top";
      hreflang: string | undefined;
      ping: string | undefined;
      type: string | undefined;
      disabled?: boolean;
    };
  }
>((props, ref) => {
  const { custom } = props;

  const onClickCb = useCallback(
    (e: React.MouseEvent) => {
      if (props.custom.disabled === true) {
        e.preventDefault(); // prevent default link behavior
        e.stopPropagation(); // stop event propagation
        return;
      } else {
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
      }
    },
    [props]
  );
  return (
    <>
      <style>
        {`.disabled {
            background-color: lightgrey;
            cursor: not-allowed;
          }
        `}
      </style>
      <a
        ref={ref}
        style={props.styles}
        className={
          props.custom.disabled === true ? "disabled" : props.className
        }
        {...custom}
        onClick={onClickCb}
      >
        {props.children}
      </a>
    </>
  );
});

export default Anchor;
