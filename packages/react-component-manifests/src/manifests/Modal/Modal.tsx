import React, { forwardRef, useContext, useEffect, useState } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { GlobalContext, createPortal } from "@atrilabs/core/lib/reactUtilities";
import { ReactComponent as Icon } from "./icon.svg";

export const Modal = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      modalSize: string;
      okButtonColor: string;
      okButtonBgColor: string;
      okButtonBorderColor: string;
      cancelButtonColor: string;
      cancelButtonBgColor: string;
      cancelButtonBorderColor: string;
      closeModalAfter?: number;
      open: boolean;
      body: string;
      title: string;
    };
    onClick: (buttonClicked: "OK" | "Cancel") => void;
    className?: string;
  }
>((props, ref) => {
  const globalContext = useContext(GlobalContext);

  const [open, setOpen] = useState<boolean>(props.custom.open);
  useEffect(() => {
    setOpen(props.custom.open);
  }, [props.custom.open]);

  useEffect(() => {
    if (props.custom.closeModalAfter && open) {
      setTimeout(() => {
        setOpen(false);
      }, props.custom.closeModalAfter);
    }
  }, [props.custom.closeModalAfter, open]);

  return createPortal(
    <div
      ref={ref}
      className={props.className}
      style={{
        backgroundColor: "#00000073",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display:
          open !== undefined ? (open ? "flex" : "none") : props.styles.display,
        zIndex: 2,
        ...props.styles,
      }}
    >
      <div
        tabIndex={-1}
        className="atri-modal-wrap"
        style={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          backgroundColor: "#fff",
          width: props.custom.modalSize,
        }}
      >
        <div
          className="atri-modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px 24px",
            color: "#000000d9",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="atri-modal-title" style={{ fontWeight: 500 }}>
            {props.custom.title}
          </div>
          <button
            type="button"
            aria-label="Close"
            className="atri-modal-close"
            style={{
              color: "#00000073",
              textDecoration: "none",
              background: "0 0",
              border: 0,
              outline: 0,
              cursor: "pointer",
              transition: "color 0.3s",
            }}
          >
            <svg
              viewBox="64 64 896 896"
              data-icon="close"
              width="1em"
              height="1em"
              fill="currentColor"
            >
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
            </svg>
          </button>
        </div>
        <div className="atri-modal-body" style={{ padding: "16px 24px" }}>
          <p>{props.custom.body}</p>
        </div>
        <div
          className="atri-modal-footer"
          style={{
            display: "flex",
            columnGap: "0.5em",
            justifyContent: "flex-end",
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            padding: "16px 24px",
          }}
        >
          <button
            type="button"
            className="atri-btn-cancel"
            style={{
              backgroundColor: props.custom.cancelButtonBgColor,
              color: props.custom.cancelButtonColor,
              border: `1px solid ${props.custom.cancelButtonBorderColor}`,
              padding: "8px 12px",
            }}
          >
            <span>Cancel</span>
          </button>
          <button
            type="button"
            className="atri-btn-ok"
            style={{
              backgroundColor: props.custom.okButtonBgColor,
              color: props.custom.okButtonColor,
              border: `1px solid ${props.custom.okButtonBorderColor}`,
              padding: "8px 12px",
            }}
          >
            <span>OK</span>
          </button>
        </div>
      </div>
    </div>,
    globalContext.window,
    "body",
    globalContext.portals
  );
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
    modalSize: { type: "text" },
    okButtonColor: { type: "color" },
    okButtonBgColor: { type: "color" },
    okButtonBorderColor: { type: "color" },
    cancelButtonColor: { type: "color" },
    cancelButtonBgColor: { type: "color" },
    cancelButtonBorderColor: { type: "color" },
    closeModalAfter: { type: "number" },
    open: { type: "boolean" },
    body: { type: "large_text" },
    title: { type: "text" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Modal", category: "Basics" },
  render: {
    comp: Modal,
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
          modalSize: "50%",
          okButtonColor: "#fff",
          okButtonBgColor: "#1890ff",
          okButtonBorderColor: "#1890ff",
          cancelButtonColor: "#000",
          cancelButtonBgColor: "#fff",
          cancelButtonBorderColor: "#d9d9d9",
          open: true,
          body: "Type something here!",
          title: "Some Title",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onClick: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Modal", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Modal", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
