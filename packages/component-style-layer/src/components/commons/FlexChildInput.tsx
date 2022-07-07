import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React from "react";
import { CssProprtyComponentType } from "../../types";

export type FlexChildInputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string | number;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    borderRadius: "2px",
    textAlign: "center",
    lineHeight: "25px",
  },
};

export const FlexChildInput: React.FC<FlexChildInputProps> = (props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    
      props.patchCb({
        property: {
          styles: {
            [styleItem]: parseInt(e.target.value),
          },
        },
      });
  };
  return (
    <div>
      <input
        type="text"
        value={props.styles[props.styleItem] || props.defaultValue}
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
      />
    </div>
  );
};
