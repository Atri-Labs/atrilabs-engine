import React, { forwardRef, useCallback } from "react";

const Input = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { value: string; placeholder: string; isPasswordField?: boolean };
    onChange: (value: string) => void;
    onPressEnter: () => void;
    className?: string;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.value);
    },
    [props]
  );
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        props.onPressEnter();
      }
    },
    [props]
  );
  return (
    <input
      ref={ref}
      className={props.className}
      style={props.styles}
      onChange={onChange}
      placeholder={props.custom.placeholder}
      value={props.custom.value}
      onKeyDown={onKeyDown}
      type={props.custom.isPasswordField ? "password" : undefined}
    />
  );
});

export default Input;
