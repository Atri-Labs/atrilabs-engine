import React, { forwardRef, useCallback } from "react";

export const Dropdown = forwardRef<
  HTMLSelectElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: {
      selectedValue?: string;
      dropdownItems: { displayed: string; value: string }[];
      disabled?: boolean;
    };
    onChange: (selectedValue: string) => void;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange(e.target.value);
    },
    [props]
  );
  return (
    <select
      value={props.custom.selectedValue}
      onChange={onChange}
      disabled={props.custom.disabled}
      className={`${props.className} ${props.attrs.class}`}
      style={props.styles}
      ref={ref}
      id={props.id}
    >
      {props.custom.dropdownItems.map((dropdownItem, index) => {
        return (
          <option value={dropdownItem.value} key={index}>
            {dropdownItem.displayed || dropdownItem.value}
          </option>
        );
      })}
    </select>
  );
});

export default Dropdown;
