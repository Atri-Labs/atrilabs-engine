import React, { forwardRef, useEffect, useState } from "react";
import { Button, Modal as AntdModal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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
    };
    onCancel?: Function;
    onOk?: Function;
    afterClose: Function;
    className?: string;
  }
>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  console.log("props.custom.type", props.custom.type);
  const displayModal = () => {
    let modalResult = null;
    switch (props.custom.type) {
      case "info":
        modalResult = AntdModal.info({
          title: props.custom.text || "This is a notification message",
          content: props.custom.content,
        });
        break;
      case "success":
        modalResult = AntdModal.success({
          title: props.custom.text,
          content: props.custom.content,
        });
        break;
      case "error":
        modalResult = AntdModal.error({
          title: props.custom.text || "This is an error message",
          content: props.custom.content,
        });
        break;
      case "warning":
        modalResult = AntdModal.warning({
          title: props.custom.text || "This is a warning message",
          content: props.custom.content,
        });
        break;
      case "confirm":
        modalResult = AntdModal.confirm({
          title: props.custom.text || "confirm",
          content: props.custom.content,
        });
        break;
      default:
        break;
    }
    return modalResult;
  };

  // if (!props.custom.type) {
  //   return (
  //     <div ref={ref} style={props.styles} className={props.className}></div>
  //   );
  // }

  return (
    <div ref={ref} style={props.styles} className={props.className}>
      {props.custom.type !== undefined || "" ? (
        <>{displayModal()}</>
      ) : (
        <AntdModal
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              {props.custom.icon && (
                <img src={props.custom.icon} alt={props.custom.icon} />
              )}
              <span>{props.custom.text}</span>
            </div>
          }
          open={isModalOpen}
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
            <div style={{ padding: "8px 0 0 32px" }}>
              {props.custom.content}
            </div>
          ) : (
            <p>{props.custom.content}</p>
          )}
        </AntdModal>
      )}
    </div>
  );
});

export default Modal;
