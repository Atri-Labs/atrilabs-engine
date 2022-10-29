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
    custom: {};
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const el: React.MutableRefObject<HTMLDivElement> = useRef(
    document.createElement("div")
  );
  const [dynamic, setDynamic] = useState(!el.current.parentElement);
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
  return createPortal(
    <div
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      <div className="ant-modal-root">
        <div tabIndex={-1} className="ant-modal-wrap">
          <div className="ant-modal-header">
            <div className="ant-modal-title" id="rc_unique_2">
              Basic Modal
            </div>
            <button
              type="button"
              aria-label="Close"
              className="ant-modal-close"
              onClick={() => {
                console.log("Closed");
              }}
              style={{ backgroundColor: "red" }}
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
          <div className="ant-modal-body">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </div>
          <div className="ant-modal-footer">
            <button type="button" className="ant-btn-cancel" onClick={() => {console.log("Cancel clicked")}}>
              <span>Cancel</span>
            </button>
            <button type="button" className="ant-btn-ok" disabled={true}>
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
  dataTypes: {},
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
        initialValue: {},
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
