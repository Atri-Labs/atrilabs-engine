import React from "react";
import { gray300, gray800 } from "../../consts/colors";
import { smallText } from "../../consts/typography";
import styles from "../../stylesheets/form-field.module.css";

export type InputProps = {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
};

// Controlled Component
export const Input: React.FC<InputProps> = React.memo((props) => {
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
        if (props.onChange) props.onChange(e.target.value);
      }}
      value={props.value}
      disabled={props.disabled}
    />
  );
});
