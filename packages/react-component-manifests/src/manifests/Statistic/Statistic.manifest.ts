import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  flexContainerOptions: false,
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
    title: { type: "text" },
    value: { type: "text" },
    groupSeparator: { type: "text" },
    decimalSeparator: { type: "text" },
    precision: { type: "number" },
    prefix: { type: "text" },
    prefixIcon: { type: "static_asset" },
    suffix: { type: "text" },
    suffixIcon: { type: "static_asset" },
    loading: { type: "boolean" },
    countdown: { type: "boolean" },
    format: {
      type: "enum",
      options: ["DD:HH:mm:ss", "HH:mm:ss", "mm:ss", "ss"],
    },
    countdownValue: { type: "number" },
    inputType: {
      type: "enum",
      options: ["minute", "hour", "second"],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Statistic", category: "Basics" },
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
          title: "Account Balance (CNY)",
          value: 112893,
          precision: 2,
          decimalSeparator: ".",
          groupSeparator: ",",
          loading: false,
          countdown: false,
          format: "HH:mm:ss",
          countdownValue: 1,
          inputType: "minute",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Statistic" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Statistic",
      containerStyle: { padding: "1rem" },
    },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
