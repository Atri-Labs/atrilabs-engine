import React, { forwardRef, useCallback, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import AlertStyles from "./AlertStyles";
import closeIcon from "./close.svg";
import SuccessIcon from "./success.svg";
import InfoIcon from "./info.svg";
import WarningIcon from "./warning.svg";
import ErrorIcon from "./error.svg";
import { ReactComponent as Icon } from "./icon.svg";

export const Alert = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      alertType: string;
      title: string;
      description?: string;
      successIcon?: string;
      infoIcon?: string;
      warningIcon?: string;
      errorIcon?: string;
      isClosable: boolean;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );

  const alertStyle = useMemo(() => {
    const alertType = AlertStyles[props.custom.alertType];
    if (alertType === undefined)
      return {
        backgroundColor: AlertStyles["success"].backgroundColor,
        border: `1px solid ${AlertStyles["success"].borderColor}`,
        color: "#000000d9",
      };
    return {
      backgroundColor: alertType.backgroundColor,
      border: `1px solid ${alertType.borderColor}`,
      color: "#000000d9",
    };
  }, [props.custom.alertType]);

  const alertStatusIcon = useMemo(() => {
    const alertType = props.custom.alertType;
    if (alertType === "error") {
      return props.custom.errorIcon || ErrorIcon;
    } else if (alertType === "warning") {
      return props.custom.warningIcon || WarningIcon;
    } else if (alertType === "info") {
      return props.custom.infoIcon || InfoIcon;
    } else {
      return props.custom.successIcon || SuccessIcon;
    }
  }, [
    props.custom.alertType,
    props.custom.errorIcon,
    props.custom.warningIcon,
    props.custom.infoIcon,
    props.custom.successIcon,
  ]);

  return (
    <>
      <style>
        {`#icon {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }

          #icon-logo {
            max-width: 1rem;
          }

          #information {
            row-gap: 1rem;
          }

          #information {
            font-size: 1rem;
            font-weight: 700;
          }

          #description {
            font-size: 0.8rem;
            font-weight: 300;
          }

          #close-button {
            border: none;
            background-color: #00000000;
          }
        `}
      </style>
      <div
        ref={ref}
        className={props.className}
        style={{ ...alertStyle, ...props.styles }}
        onClick={onClick}
      >
        <div id="icon">
          <img id="icon-logo" src={alertStatusIcon} alt="Icon for alert" />
        </div>
        <div id="information">
          <div>{props.custom.title}</div>
          <div id="description">{props.custom.description}</div>
        </div>
        {props.custom.isClosable && (
          <button id="close-button">
            <img
              id="close-button"
              src={closeIcon}
              alt="Icon to close the alert"
            />
          </button>
        )}
      </div>
    </>
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
    alertType: {
      type: "enum",
      options: ["success", "info", "warning", "error"],
    },
    title: { type: "text" },
    description: { type: "text" },
    successIcon: { type: "static_asset" },
    infoIcon: { type: "static_asset" },
    warningIcon: { type: "static_asset" },
    errorIcon: { type: "static_asset" },
    isClosable: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Alert", category: "Basics" },
  render: {
    comp: Alert,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          paddingTop: "15px",
          paddingLeft: "24px",
          paddingBottom: "15px",
          paddingRight: "15px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          columnGap: "10px",
          justifyContent: "space-between",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          title: "Alert Title",
          description: "Alert Description",
          isClosable: true,
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
  panel: { comp: CommonIcon, props: { name: "Alert", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Alert", containerStyle: { padding: "1rem", svg: Icon } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
