import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

export const Upload = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { multiple: boolean; files: FileList };
    onChange: (files: FileList) => void;
  }
>((props, ref) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.files) props.onChange(e.target.files);
    },
    [props]
  );
  return (
    <input
      ref={ref}
      type={"file"}
      multiple={props.custom.multiple}
      onChange={onChange}
    />
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    multuple: "text",
    files: "static_asset",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Upload" },
  render: {
    comp: Upload,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          multiple: false,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "file_input", selector: ["custom", "files"] }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendFile: { self: true, props: ["custom", "files"] } }],
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Upload" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Upload", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
