import React, { forwardRef } from "react";
import { Modal as AntdModal } from "antd";

const Modal = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    children?: React.ReactNode[];
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
      confirmLoading?: boolean;
    };
    onCancel?: Function;
    afterClose: Function;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };
  const { custom } = props;
  return (
    <div ref={ref} id={props.id}>
      <AntdModal
        style={props.styles}
        width={props.styles.width}
        className={`${props.className} ${props.attrs.class}`}
        {...custom}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            {props.custom.icon && (
              <img src={props.custom.icon} alt={props.custom.icon} />
            )}
            <span>{props.custom.text}</span>
          </div>
        }
        onCancel={handleCancel}
        closeIcon={
          props.custom.closeIcon && (
            <img src={props.custom.closeIcon} alt={props.custom.closeIcon} />
          )
        }
        footer={null}
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
