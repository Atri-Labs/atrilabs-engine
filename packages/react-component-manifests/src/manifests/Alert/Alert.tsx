import React, { forwardRef, useCallback, useMemo } from "react";
import AlertStyles from "./AlertStyles";
import { Alert as AntdAlert } from "antd";

const enum AlertType {
  SUCEESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

const Alert = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      alertType: AlertType;
      text: string;
      description?: string;
      icon?: string;
      successIcon?: string;
      infoIcon?: string;
      warningIcon?: string;
      errorIcon?: string;
      isClosable: boolean;
      showIcon?: boolean;
      closeText?: string;
      closeIcon?: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
    showIcon?: boolean;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );

  const alertStyle = useMemo(() => {
    const alertType = AlertStyles[props.custom.alertType];
    if (alertType === undefined)
      return {
        backgroundColor: AlertStyles["success"].backgroundColor,
        border: `1px solid ${AlertStyles["success"].borderColor}`,
        color: "#000000d9",
      };
    return {
      backgroundColor: alertType.backgroundColor,
      border: `1px solid ${alertType.borderColor}`,
      color: "#000000d9",
    };
  }, [props.custom.alertType]);

  // moved ref to div, as the Alert select doesnt provide ref for Alert
  return (
    <>
      <style>
        {`#icon {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }

          #icon-logo {
            max-width: 1rem;
          }

          #information {
            row-gap: 1rem;
          }

          #information {
            font-size: 1rem;
            font-weight: 700;
          }

          #description {
            font-size: 0.8rem;
            font-weight: 300;
          }

          #close-button {
            border: none;
            background-color: #00000000;
          }
        `}
      </style>
      <div ref={ref}>
        <AntdAlert
          className={props.className}
          style={{ ...alertStyle, ...props.styles }}
          {...restProps}
          onClick={onClick}
          type={props.custom.alertType || AlertType.SUCEESS}
          icon={
            props.custom.icon && (
              <img src={props.custom.icon} alt={props.custom.icon} />
            )
          }
          showIcon={props.custom.showIcon} //it will show antd icon
          message={props.custom.text}
          description={props.custom.description}
          closable={props.custom?.isClosable}
          closeText={props.custom?.closeText}
          closeIcon={
            props.custom.closeIcon && (
              <img src={props.custom.closeIcon} alt={props.custom.closeIcon} />
            )
          }
        />
      </div>
    </>
  );
});

export default Alert;
