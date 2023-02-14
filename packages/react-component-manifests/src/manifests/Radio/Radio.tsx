import React, { forwardRef, useCallback } from "react";

const Radio = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { name: string; label: string; checked: boolean; radius?: string };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onChangeCb: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <div style={props.styles} ref={ref} className={props.className}>
      <input
        type="radio"
        onChange={onChangeCb}
        name={props.custom.name}
        value={props.custom.label}
        checked={props.custom.checked}
        style={{
          ...props.styles,
          height: props.custom.radius,
          width: props.custom.radius,
        }}
      />
      {props.custom.label ? <label>{props.custom.label}</label> : null}
    </div>
  );
});

export default Radio;
