import React, { useState, useEffect } from "react";
import { gray300, gray800 } from "../../consts/colors";
import { smallText } from "../../consts/typography";
import styles from "../../stylesheets/form-field.module.css";

export type InputProps = {
  onChange?: (value: string) => void;
  initialValue?: string;
};

export const Input: React.FC<InputProps> = React.memo((props) => {
  const [value, setValue] = useState<string>(props.initialValue || "");
  useEffect(() => {
    setValue(props.initialValue || "");
  }, [props]);
  return (
    <input
      style={{
        width: "10rem",
        boxSizing: "border-box",
        height: "1.4rem",
        background: `${gray800}`,
        ...smallText,
        color: gray300,
        borderRadius: "4px",
        padding: "0.2rem",
      }}
      className={styles["formfield"]}
      onChange={(e) => {
        setValue(e.target.value);
        if (props.onChange) props.onChange(e.target.value);
      }}
      value={value}
    />
  );
});
