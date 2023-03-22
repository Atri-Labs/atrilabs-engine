import React, { forwardRef } from "react";
import { Modal as AntdModal } from "antd";

const Modal = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      text?: string;
      content?: string;
      cancelText?: string;
      okText?: string;
      centered?: boolean;
      closable?: boolean;
      destroyOnClose?: boolean;
      keyboard?: boolean;
      mask?: boolean;
      maskClosable?: boolean;
      zIndex?: number;
      type?: "info" | "success" | "error" | "warning" | "confirm";
      icon?: string;
      closeIcon?: string;
      open?: boolean;
    };
    onCancel?: Function;
    onOk?: Function;
    afterClose: Function;
    className?: string;
  }
>((props, ref) => {
  const handleOk = () => {
    if (props.onOk) {
      props.onOk();
    }
  };

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };

  return (
    <div ref={ref}>
      <AntdModal
        style={props.styles}
        className={props.className}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            {props.custom.icon && (
              <img src={props.custom.icon} alt={props.custom.icon} />
            )}
            <span>{props.custom.text}</span>
          </div>
        }
        open={props.custom.open}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={props.custom.cancelText}
        okText={props.custom.okText}
        centered={props.custom.centered}
        closable={props.custom.closable}
        destroyOnClose={props.custom.destroyOnClose}
        keyboard={props.custom.keyboard}
        mask={props.custom.mask}
        maskClosable={props.custom.maskClosable}
        zIndex={props.custom.zIndex}
        closeIcon={
          props.custom.closeIcon && (
            <img src={props.custom.closeIcon} alt={props.custom.closeIcon} />
          )
        }
      >
        {props.custom.icon !== undefined || "" ? (
          <div style={{ padding: "8px 0 0 32px" }}>{props.custom.content}</div>
        ) : (
          <p>{props.custom.content}</p>
        )}
      </AntdModal>
    </div>
  );
});

export default Modal;
