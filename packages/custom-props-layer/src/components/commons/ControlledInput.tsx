import { gray900 } from "@atrilabs/design-system";
import React, { useEffect, useRef, useState } from "react";

export type ControlledInputProps = {
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    height: "25px",
    backgroundColor: gray900,
    border: "none",
    outline: "none",
    color: "white",
    padding: "0 4px",
    minWidth: "none",
    width: "calc(100% - 0.5rem)",
  },
};

const ControlledInput: React.FC<ControlledInputProps> = ({
  value,
  onChange,
}) => {
  const [cursor, setCursor] = useState<number>();
  const ref = useRef<any>(null);

  useEffect(() => {
    const input = ref.current;
    if (input) {
      input.setSelectionRange(cursor, cursor);
    }
  }, [ref, cursor, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.selectionStart || e.target.selectionStart === 0) {
      setCursor(e.target.selectionStart);
    }
    onChange && onChange(e);
  };

  return (
    <input
      ref={ref}
      value={value}
      onChange={handleChange}
      style={styles.inputBox}
    />
  );
};

export default ControlledInput;
