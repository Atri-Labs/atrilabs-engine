import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { createPortal } from "react-dom";
import "./Modal.css";

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
      closeModalAfter: number;
      open: boolean;
      content: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const el: React.MutableRefObject<HTMLDivElement> = useRef(
    document.createElement("div")
  );
  const [dynamic, setDynamic] = useState(props.custom.open);
  useEffect(() => {
    if (dynamic) {
      el.current.id = "modal-root";
      document.body.appendChild(el.current);
    }
    return () => {
      if (dynamic && el.current.parentElement) {
        el.current.parentElement.removeChild(el.current);
      }
    };
  }, [dynamic]);
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setDynamic(false);
    }, props.custom.closeModalAfter);
    return () => clearTimeout(timer);
  }, []);
  return createPortal(
    <div
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      <div className="atri-modal-root">
        <div
          tabIndex={-1}
          className="atri-modal-wrap"
          style={{ width: props.custom.modalSize }}
        >
          <div className="atri-modal-header">
            <div className="atri-modal-title" id="rc_unique_2">
              Basic Modal
            </div>
            <button
              type="button"
              aria-label="Close"
              className="atri-modal-close"
              onClick={() => {
                setDynamic(false);
              }}
            >
              <svg
                viewBox="64 64 896 896"
                // focusable="false"
                data-icon="close"
                width="1em"
                height="1em"
                fill="currentColor"
                // aria-hidden="true"
              >
                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
              </svg>
            </button>
          </div>
          <div className="atri-modal-body">
            <p>{props.custom.content}</p>
          </div>
          <div className="atri-modal-footer">
            <button
              type="button"
              className="atri-btn-cancel"
              style={{
                backgroundColor: props.custom.cancelButtonBgColor,
                color: props.custom.cancelButtonColor,
                border: `1px solid ${props.custom.cancelButtonBorderColor}`,
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
              }}
            >
              <span>OK</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    el.current
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
    content: { type: "large_text" },
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
          cancelButtonBorderColor: "#000",
          closeModalAfter: 3000,
          open: true,
          content: "Type something here!"
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
  panel: { comp: CommonIcon, props: { name: "Modal" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Modal", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
