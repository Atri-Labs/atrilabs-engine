import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useLayoutEffect, useRef, useState } from "react";

export type ControlledInputProps = {
  type: string;
  value: string | number | undefined;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => void;
  styleItem: keyof React.CSSProperties;
  disabled: string;
  placeholder: string;
  pattern: string | undefined;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    height: "26px",
    width: "25px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    paddingLeft: "6px",
  },
};

/**
 * This controlled input code is inspired from
 * https://stackoverflow.com/a/68928267/8755319
 * @param param0
 * @returns
 */
const ControlledInput: React.FC<ControlledInputProps> = ({
  type,
  value,
  onChange,
  styleItem,
  disabled,
  placeholder,
  pattern,
}) => {
  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<any>(null);

  useLayoutEffect(() => {
    const input = ref.current;
    if (input) {
      input.setSelectionRange(cursor, cursor);
    }
  }, [ref, cursor, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e, styleItem);
  };

  return (
    <input
      ref={ref}
      value={value}
      onChange={handleChange}
      type={type}
      style={styles.inputBox}
      placeholder={placeholder}
      disabled={disabled === "auto" ? true : false}
      pattern={pattern}
    />
  );
};

export default ControlledInput;
