import React from "react";
import { CssProprtyComponentType } from "../../types";
import ControlledInput from "./ControlledInput";

export type InputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
  parseToInt: boolean;
};

export const Input: React.FC<InputProps> = (props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    if (props.parseToInt) {
      props.patchCb({
        property: {
          styles: {
            [styleItem]: parseInt(e.target.value),
          },
        },
      });
    } else {
      props.patchCb({
        property: {
          styles: {
            [styleItem]: e.target.value,
          },
        },
      });
    }
  };
  return (
    <div>
      <ControlledInput
        type="text"
        value={props.styles[props.styleItem] || ""}
        onChange={handleChange}
        styleItem={props.styleItem}
        disabled={""}
        placeholder={props.defaultValue}
        pattern={props.parseToInt ? "[0-9]+" : undefined}
      />
    </div>
  );
};
