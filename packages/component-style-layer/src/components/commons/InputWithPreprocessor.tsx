import { gray100, gray400, gray800, smallText } from "@atrilabs/design-system";
import React from "react";
import { CssProprtyComponentType } from "../../types";

export type SizeInputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
  placeHolderText: string;
  preProcessor?: (
    value: string | number | undefined,
    mode: "read" | "write"
  ) => number | string;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    lineHeight: "20px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    backgroundColor: gray800,
    borderRadius: "0 2px 2px 0",
    display: "flex",
    alignItems: "center",
    paddingRight: "4px",
  },
};

export const InputWithPreprocessor: React.FC<SizeInputProps> = (props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: props.preProcessor
            ? props.preProcessor(e.target.value, "write")
            : parseInt(e.target.value),
        },
      },
    });
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={
          props.preProcessor
            ? props.preProcessor(
                props.styles[props.styleItem]?.toString(),
                "read"
              )
            : props.styles[props.styleItem] || ""
        }
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
        placeholder={props.defaultValue}
      />
      <div style={styles.inputSpan}>{props.placeHolderText}</div>
    </div>
  );
};
