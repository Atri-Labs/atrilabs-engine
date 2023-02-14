import React, { forwardRef, useCallback } from "react";
import { ReactComponent as MenuIcon } from "./menu.svg";

const Menu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      open: boolean;
      iconHeight: number;
      iconWidth: number;
      src?: string;
      strokeColor?: string;
      gap?: number;
      alignRight?: boolean;
    };
    onClick: (open: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick(!props.custom.open);
  }, [props]);
  const gap = typeof props.custom.gap === "number" ? props.custom.gap : 0;
  return (
    <div
      ref={ref}
      style={{ ...props.styles, position: "relative" }}
      className={props.className}
    >
      <div
        style={{
          height: `${props.custom.iconHeight}px`,
          width: `${props.custom.iconWidth}px`,
        }}
        onClick={onClick}
      >
        {props.custom.src ? (
          <img src={props.custom.src} alt="menu icon" />
        ) : (
          <MenuIcon
            style={{
              stroke: props.custom.strokeColor
                ? props.custom.strokeColor
                : "black",
            }}
          />
        )}
      </div>
      <div
        style={{
          display: props.custom.open ? "flex" : "none",
          flexDirection: "column",
          position: "absolute",
          top: "100%",
          right: props.custom.alignRight ? gap : "",
          left: !props.custom.alignRight ? gap : "",
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

export default Menu;
