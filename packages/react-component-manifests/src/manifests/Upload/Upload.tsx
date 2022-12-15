import React, { forwardRef, useCallback, useRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  ReactComponentManifestSchema,
  IoProp,
} from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./upload.svg";

const fileIoProp: IoProp = {
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

const DevUpload: typeof Upload = forwardRef((props, ref) => {
  props.custom.disabled = true;
  return <Upload {...props} ref={ref} />;
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: true,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    multuple: { type: "boolean" },
    showFilename: { type: "boolean" },
    text: { type: "text" },
    disabled: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Upload", category: "Basics" },
  render: {
    comp: Upload,
  },
  dev: {
    comp: DevUpload,
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#1890ff",
          paddingTop: "8px",
          paddingLeft: "15px",
          paddingBottom: "8px",
          paddingRight: "15px",
          fontSize: "16px",
          borderRadius: "2px",
          outline: "none",
          fontWeight: 400,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#1890ff",
          cursor: "pointer",
          userSelect: "none",
          columnGap: "12px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          multiple: false,
          showFilename: true,
          text: "Upload",
          disabled: false,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "file_input", selector: ["io", "files"] }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendFile: { self: true, props: ["io", "files"] } }],
    },
    ioProps: {
      io: {
        files: fileIoProp,
      },
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Upload", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Upload", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
