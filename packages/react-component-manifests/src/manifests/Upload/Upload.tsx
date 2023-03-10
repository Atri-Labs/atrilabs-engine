import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Button, message, Upload as AntdUpload, Modal } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
const { Dragger } = AntdUpload;

// delete code after removing dev
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
      text: string;
      listType?: "text" | "picture-card" | "picture-circle";
      dragger?: boolean;
      maxCount?: number;
      multiple?: boolean;
      disabled?: boolean;
      directory?: boolean;
      allowFiles?: "all" | "image" | "video";
    };
    onChange: (files: FileList) => void;
    io: { files: FileList };
    className?: string;
  }
>((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{props.custom.text}</div>
    </div>
  );

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const prop: UploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },

    onChange(info) {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        setLoading(false);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {},
    beforeUpload: (file) => {
      if (props.custom.allowFiles !== "all") {
        const isFile = file.type.startsWith(
          props.custom.allowFiles === "image" ? "image/" : "video/"
        );
        if (!isFile) {
          message.error(
            `${file.name} is not a ${props.custom.allowFiles} file`
          );
        }
        return isFile || AntdUpload.LIST_IGNORE;
      }
    },
  };
  return (
    <div ref={ref}>
      {props.custom.dragger === true ? (
        <Dragger
          {...prop}
          style={props.styles}
          className={props.className}
          maxCount={props.custom.maxCount}
          multiple={props.custom.multiple}
          disabled={props.custom.disabled}
          directory={props.custom.directory}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{props.custom.text}</p>
        </Dragger>
      ) : (
        <>
          <AntdUpload
            {...prop}
            style={props.styles}
            className={props.className}
            listType={props.custom.listType}
            onPreview={handlePreview}
            maxCount={props.custom.maxCount}
            multiple={props.custom.multiple}
            disabled={props.custom.disabled}
            directory={props.custom.directory}
          >
            {props.custom.listType !== "text" ? (
              uploadButton
            ) : (
              <Button icon={<UploadOutlined />}>{props.custom.text}</Button>
            )}
          </AntdUpload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
      )}
    </div>
  );
});

export default Upload;

// import React, { forwardRef, useCallback, useRef } from "react";
// import type { IoProp } from "@atrilabs/react-component-manifest-schema";
// import { UploadOutlined } from "@ant-design/icons";
// import type { UploadProps } from "antd";
// import { Button, message, Upload as AntdUpload } from "antd";

// export const fileIoProp: IoProp = {
//   type: "files",
//   mode: "upload",
// };

// export const Upload = forwardRef<
//   HTMLInputElement,
//   {
//     styles: React.CSSProperties;
//     custom: {
//       multiple: boolean;
//       showFilename: boolean;
//       text: string;
//       disabled: boolean;
//     };
//     onChange: (files: FileList) => void;
//     io: { files: FileList };
//     className?: string;
//   }
// >((props, ref) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
//     (e) => {
//       if (e.target.files) props.onChange(e.target.files);
//     },
//     [props]
//   );
//   const onClickCb = useCallback(() => {
//     const inputEl = inputRef.current;
//     if (inputEl && !props.custom.disabled) {
//       inputEl.click();
//     }
//   }, [props.custom.disabled]);
//   return (
//     <div ref={ref}>
//       <AntdUpload style={props.styles} className={props.className}>
//         <Button icon={<UploadOutlined />}>Click to Upload</Button>
//       </AntdUpload>
//     </div>
//   );
// });

// export default Upload;
// <div>{props.custom.text}</div>
// {props.custom.showFilename ? (
//   <div style={{ fontSize: "0.75em" }}>
//     {props.io && props.io.files && props.io.files[0]
//       ? props.io.files[0].name
//       : "No files selected"}
//   </div>
// ) : null}
// <input
//   ref={inputRef}
//   type={"file"}
//   multiple={props.custom.multiple}
//   onChange={onChange}
//   style={{ display: "none" }}
// />
