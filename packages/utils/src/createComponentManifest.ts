import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import type {
  ReactComponentManifestSchema,
  SendFileCallbackHandler,
  AcceptsChildFunction,
} from "@atrilabs/react-component-manifest-schema";
import { reactSchemaId, iconSchemaId, CustomTreeId, CSSTreeId } from "./consts";
import {
  flexRowSort,
  flexColSort,
  flexRowReverseSort,
  flexColReverseSort,
} from "@atrilabs/react-component-manifest-schema";

const defaultFlexAcceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  const flexDirection: "row" | "column" | "row-reverse" | "column-reverse" =
    info.props.styles["flexDirection"] || "row";
  let index = 0;
  switch (flexDirection) {
    case "row":
      index = flexRowSort(info.loc, info.childCoordinates) || 0;
      break;
    case "column":
      index = flexColSort(info.loc, info.childCoordinates) || 0;
      break;
    case "row-reverse":
      index = flexRowReverseSort(info.loc, info.childCoordinates) || 0;
      break;
    case "column-reverse":
      index = flexColReverseSort(info.loc, info.childCoordinates) || 0;
      break;
  }
  return index;
};

const defaultAcceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  return flexRowSort(info.loc, info.childCoordinates) || 0;
};

function extractAcceptsChild(
  acceptsChild: boolean | "flex" | AcceptsChildFunction | undefined
) {
  if (typeof acceptsChild === "function") {
    return acceptsChild;
  }

  switch (acceptsChild) {
    case true:
      return defaultAcceptsChild;
    case "flex":
      return defaultFlexAcceptsChild;
  }

  return undefined;
}

export type CreateManifestOptions = {
  name: string;
  category?: string;
  styles?: Partial<CSSTreeOptions>;
  initialStyles?: React.CSSProperties;
  custom?: CustomPropsTreeOptions["dataTypes"];
  initalCustomValues?: any;
  callbacks?: {
    [callbackName: string]: {
      updateFields?: string[] | string[][]; // selector array for controlled field
      importFile?: string[] | string[][]; // selector array for controlled file input
      // set default callback handlers
      sendEventData?: boolean;
      sendFile?: SendFileCallbackHandler;
    };
  };
  acceptsChild?: boolean | "flex" | AcceptsChildFunction;
};

export function createComponentManifest(options: CreateManifestOptions) {
  const callbackNames = Object.keys(options.callbacks || {});

  const attachCallbacks: ReactComponentManifestSchema["dev"]["attachCallbacks"] =
    {};
  callbackNames.reduce((prev, curr) => {
    const attachCallbackValue: ReactComponentManifestSchema["dev"]["attachCallbacks"]["0"] =
      [];
    const callback = options.callbacks![curr]!;
    if (callback.updateFields) {
      if (
        Array.isArray(callback.updateFields) &&
        callback.updateFields.length > 0
      ) {
        if (Array.isArray(callback.updateFields[0])) {
          attachCallbackValue.push(
            ...(callback.updateFields as string[][]).map((selector) => {
              return { type: "controlled" as "controlled", selector };
            })
          );
        } else {
          attachCallbackValue.push({
            type: "controlled",
            selector: callback.updateFields as string[],
          });
        }
      }
    }
    if (callback.importFile) {
      if (
        Array.isArray(callback.importFile) &&
        callback.importFile.length > 0
      ) {
        if (Array.isArray(callback.importFile[0])) {
          attachCallbackValue.push(
            ...(callback.importFile as string[][]).map((selector) => {
              return { type: "file_input" as "file_input", selector };
            })
          );
        } else {
          attachCallbackValue.push({
            type: "file_input",
            selector: callback.importFile as string[],
          });
        }
      }
    }
    // update prev object
    prev[curr] = attachCallbackValue;
    return prev;
  }, attachCallbacks);

  const defaultCallbackHandlers: ReactComponentManifestSchema["dev"]["defaultCallbackHandlers"] =
    {};
  callbackNames.reduce((prev, curr) => {
    const defaultCallbackHandler: ReactComponentManifestSchema["dev"]["defaultCallbackHandlers"]["0"] =
      [];
    const callback = options.callbacks![curr]!;
    if (callback.sendEventData) {
      defaultCallbackHandler.push({ sendEventData: true });
    }
    if (callback.sendFile) {
      defaultCallbackHandler.push({
        sendFile: options.callbacks![curr].sendFile!,
      });
    }
    // update prev object
    prev[curr] = defaultCallbackHandler;
    return prev;
  }, defaultCallbackHandlers);

  const acceptsChild = extractAcceptsChild(options.acceptsChild);

  const compManifest: ReactComponentManifestSchema = {
    meta: { key: options.name, category: options.category || "Basics" },
    dev: {
      decorators: [],
      attachProps: {
        styles: {
          treeId: CSSTreeId,
          initialValue: options.initialStyles || {},
          treeOptions: {
            boxShadowOptions: false,
            flexContainerOptions: false,
            flexChildOptions: false,
            positionOptions: false,
            typographyOptions: false,
            spacingOptions: false,
            sizeOptions: false,
            borderOptions: false,
            outlineOptions: false,
            backgroundOptions: false,
            miscellaneousOptions: false,
            ...options.initialStyles,
          },
          canvasOptions: { groupByBreakpoint: true },
        },
        custom: {
          treeId: CustomTreeId,
          initialValue: options.initalCustomValues || {},
          treeOptions: { dataTypes: options.custom },
          canvasOptions: { groupByBreakpoint: false },
        },
      },
      attachCallbacks,
      defaultCallbackHandlers,
      acceptsChild,
    },
  };
  const iconManifest = {
    panel: { comp: "CommonIcon", props: { name: options.name } },
    drag: {
      comp: "CommonIcon",
      props: { name: options.name, containerStyle: { padding: "1rem" } },
    },
    renderSchema: compManifest,
  };
  return {
    manifests: {
      [reactSchemaId]: compManifest,
      [iconSchemaId]: iconManifest,
    },
  };
}
