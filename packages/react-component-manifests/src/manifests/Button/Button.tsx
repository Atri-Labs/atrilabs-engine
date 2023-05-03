import React, { forwardRef, useCallback } from "react";
import { Button as AntdButton } from "antd";

export type ButtonShape = "default" | "circle" | "round";

export type ButtonType =
  | "primary"
  | "ghost"
  | "dashed"
  | "link"
  | "text"
  | "default";

export type ButtonSize = "large" | "middle" | "small";

export type ButtonhtmlType = "button" | "submit" | "reset";

const Button = forwardRef<
  HTMLButtonElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    custom: {
      text: string;
      icon?: string; //Set the icon component of button
      type?: ButtonType; //Can be set to primary ghost dashed link text default
      shape?: ButtonShape; //Can be set button shape
      size?: ButtonSize; //Set the size of button
      disabled?: boolean; //Disabled state of button
      loading?: boolean | { delay: number }; //Set the loading status of button
      block?: boolean; //Option to fit button width to its parent width
      danger?: boolean; //Set the danger status of button
      ghost?: boolean; //Make background transparent and invert text and border colors
      href?: string; //Redirect url of link button
      htmlType?: ButtonhtmlType; //Set the original html type of button, see: MDN
      target?: string; //	Same as target attribute of a, works when href is specified
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  const { custom } = props;
  return (
    <AntdButton
      {...custom}
      ref={ref}
      id={props.id}
      className={`${props.className} ${props.attrs?.class}`}
      style={props.styles}
      onClick={onClick}
      icon={
        props.custom.icon && (
          <img
            src={props.custom.icon}
            height="100%"
            width="100%"
            alt={props.custom.icon}
          />
        )
      }
    >
      {props.custom.text}
    </AntdButton>
  );
});

export default Button;
