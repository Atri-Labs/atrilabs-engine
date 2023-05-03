import React, { forwardRef } from "react";
import { Drawer as AntdDrawer } from "antd";

const Drawer = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    children?: React.ReactNode[];
    custom: {
      open?: boolean;
      placement?: "left" | "top" | "right" | "bottom";
      content?: string;
      closable?: boolean;
      size?: "default" | "large";
      destroyOnClose?: boolean;
      forceRender?: boolean;
      autoFocus?: boolean;
      keyboard?: boolean;
      mask?: boolean;
      maskClosable?: boolean;
      zIndex?: number;
    };
    onClose?: Function;
    afterOpenChange: Function;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleAfterOpenChange = () => {
    if (props.afterOpenChange) {
      props.afterOpenChange();
    }
  };

  return (
    <div ref={ref} id={props.id}>
      <AntdDrawer
        className={`${props.className} ${props.attrs?.class}`}
        style={props.styles}
        headerStyle={props.styles}
        {...custom}
        onClose={handleClose}
        afterOpenChange={handleAfterOpenChange}
      >
        {props.children}
      </AntdDrawer>
    </div>
  );
});
export default Drawer;
