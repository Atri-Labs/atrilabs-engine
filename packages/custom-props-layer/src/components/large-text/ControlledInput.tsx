import React, { useEffect, useRef, useState } from "react";

export type ControlledInputProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    width: "100%",
    resize: "vertical",
    fontFamily: "Inter, sans-serif",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "16px",
    marginTop: "5px",
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.selectionStart || e.target.selectionStart === 0) {
      setCursor(e.target.selectionStart);
    }
    onChange && onChange(e);
  };

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => handleChange(e)}
      rows={5}
      style={styles.inputBox}
    />
  );
};

export default ControlledInput;
