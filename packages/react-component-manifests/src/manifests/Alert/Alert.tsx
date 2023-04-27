import React, {forwardRef, useCallback} from "react";
import {Alert as AntdAlert} from "antd";

const enum AlertType {
  SUCEESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

const Alert = forwardRef<HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    custom: {
      alertType: AlertType;
      text: string;
      description?: string;
      icon?: string;
      isClosable: boolean;
      showIcon?: boolean;
      closeText?: string;
      closeIcon?: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
    showIcon?: boolean;
  }>((props, ref) => {
  const {custom, ...restProps} = props;
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({pageX: e.pageX, pageY: e.pageY});
    },
    [props]
  );
  // moved ref to div, as the Alert select doesnt provide ref for Alert
  return (
    <>
      <div ref={ref} style={{display: "inline-block"}} id={props.attrs.id}>
        <AntdAlert
          style={props.styles}
          {...restProps}
          className={`${props.className} ${props.attrs.class}`}
          onClick={onClick}
          type={props.custom.alertType || AlertType.SUCEESS}
          icon={
            props.custom.icon && (
              <img src={props.custom.icon} alt={props.custom.icon}/>
            )
          }
          showIcon={props.custom.showIcon} //it will show antd icon
          message={props.custom.text}
          description={props.custom.description}
          closable={props.custom?.isClosable}
          closeText={props.custom?.closeText}
          closeIcon={
            props.custom.closeIcon && (
              <img src={props.custom.closeIcon} alt={props.custom.closeIcon}/>
            )
          }
        />
      </div>
    </>
  );
});

export default Alert;
