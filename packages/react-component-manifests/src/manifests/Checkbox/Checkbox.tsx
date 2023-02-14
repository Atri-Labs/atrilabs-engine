import React, { forwardRef, useCallback } from "react";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { checked: boolean };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <input
      ref={ref}
      className={props.className}
      style={props.styles}
      onChange={onChange}
      type={"checkbox"}
      checked={props.custom.checked}
    />
  );
});

export default Checkbox;
