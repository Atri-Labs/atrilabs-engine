import React, { forwardRef, useCallback, useRef } from "react";
import type { IoProp } from "@atrilabs/react-component-manifest-schema";

export const fileIoProp: IoProp = {
  type: "files",
  mode: "upload",
};

export const Upload = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: {
      multiple: boolean;
      showFilename: boolean;
      text: string;
      disabled: boolean;
    };
    onChange: (files: FileList) => void;
    io: { files: FileList };
    className?: string;
  }
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.files) props.onChange(e.target.files);
    },
    [props]
  );
  const onClickCb = useCallback(() => {
    const inputEl = inputRef.current;
    if (inputEl && !props.custom.disabled) {
      inputEl.click();
    }
  }, [props.custom.disabled]);
  return (
    <div
      ref={ref}
      style={{
        ...props.styles,
        display: "inline-flex",
      }}
      onClick={onClickCb}
      className={props.className}
    >
      <div>{props.custom.text}</div>
      {props.custom.showFilename ? (
        <div style={{ fontSize: "0.75em" }}>
          {props.io && props.io.files && props.io.files[0]
            ? props.io.files[0].name
            : "No files selected"}
        </div>
      ) : null}
      <input
        ref={inputRef}
        type={"file"}
        multiple={props.custom.multiple}
        onChange={onChange}
        style={{ display: "none" }}
      />
    </div>
  );
});

export default Upload;
