import React, { forwardRef } from "react";
import { UploadOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload as AntdUpload } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

export interface UploadChangeParam<T = UploadFile> {
  file: T;
  fileList: T[];
  event?: {
    percent: number;
  };
}

const { Dragger } = AntdUpload;

export const Upload = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    id?: string;
    className?: string;
    custom: {
      text: string;
      listType?: "text" | "picture-card" | "picture-circle";
      dragger?: boolean;
      maxCount?: number;
      multiple?: boolean;
      disabled?: boolean;
      directory?: boolean;
      beforeUpload?: (
        file: RcFile,
        FileList: RcFile[]
      ) =>
        | void
        | boolean
        | string
        | Blob
        | File
        | Promise<void | boolean | string | Blob | File>;
      onChange?: (info: UploadChangeParam<UploadFile<any>>) => void;
      onDrop?: (event: React.DragEvent) => void;
      onPreview?: (file: UploadFile<any>) => void;
    };
  }
>((props, ref) => {
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ ...props.styles, marginTop: 8 }}>{props.custom.text}</div>
    </div>
  );

  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      {props.custom.dragger === true ? (
        <Dragger
          style={props.styles}
          className={`${props.className} ${props.attrs.class}`}
          maxCount={props.custom.maxCount}
          multiple={props.custom.multiple}
          disabled={props.custom.disabled}
          directory={props.custom.directory}
          beforeUpload={props.custom.beforeUpload}
          onChange={props.custom.onChange}
          onDrop={props.custom.onDrop}
          onPreview={props.custom.onPreview}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{props.custom.text}</p>
        </Dragger>
      ) : (
        <>
          <AntdUpload
            className={`${props.className} ${props.attrs.class}`}
            listType={props.custom.listType}
            maxCount={props.custom.maxCount}
            multiple={props.custom.multiple}
            disabled={props.custom.disabled}
            directory={props.custom.directory}
            beforeUpload={props.custom.beforeUpload}
            onChange={props.custom.onChange}
            onDrop={props.custom.onDrop}
            onPreview={props.custom.onPreview}
          >
            {props.custom.listType !== "text" ? (
              uploadButton
            ) : (
              <Button
                style={{
                  ...props.styles,
                  animationDuration: "0s",
                  animationTimingFunction: "unset",
                  transitionDuration: "0s",
                  transitionTimingFunction: "unset",
                }}
                icon={<UploadOutlined />}
              >
                {props.custom.text}
              </Button>
            )}
          </AntdUpload>
        </>
      )}
    </div>
  );
});

export default Upload;
