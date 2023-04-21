import { gray900 } from "@atrilabs/design-system";
import React from "react";

export const Checkbox: React.FC<{
  value: boolean;
  onChange: (newValue: boolean) => void;
}> = (props) => {
  return (
    <input
      onChange={(e) => {
        props.onChange(e.target.checked);
      }}
      type="checkbox"
      checked={props.value}
      style={{
        height: "25px",
        width: "20px",
        accentColor: gray900,
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
      }}
    />
  );
};
