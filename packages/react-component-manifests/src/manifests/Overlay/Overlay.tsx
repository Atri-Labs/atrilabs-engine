import React, { forwardRef, useEffect, useState } from "react";

const Overlay = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    children: React.ReactNode[];
    custom: {
      closeOverlayAfter?: number;
      open: boolean;
    };
    className?: string;
  }
>((props, ref) => {
  const [open, setOpen] = useState<boolean>(props.custom.open);
  useEffect(() => {
    setOpen(props.custom.open);
  }, [props.custom.open]);

  useEffect(() => {
    if (props.custom.closeOverlayAfter && open) {
      setTimeout(() => {
        setOpen(false);
      }, props.custom.closeOverlayAfter);
    }
  }, [props.custom.closeOverlayAfter, open]);

  return (
    <div
      ref={ref}
      className={`${props.className} ${props.attrs.class}`}
      style={{
        display:
          open !== undefined ? (open ? "flex" : "none") : props.styles.display,
        zIndex: 2,
        ...props.styles,
      }}
      id={props.attrs.id}
    >
      This component is a work in progress! This component needs to put a React
      portal.
      {props.children}
    </div>
  );
});

export default Overlay;
