import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";

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
    playing: { type: "boolean" },
    url: { type: "text" },
    light: { type: "text" },
    loop: { type: "boolean" },
    controls: { type: "boolean" },
    volume: { type: "number" },
    muted: { type: "boolean" },
    playbackRate: { type: "number" },
    progressInterval: { type: "number" },
    playsinline: { type: "boolean" },
    playIcon: { type: "static_asset" },
    previewTabIndex: { type: "number" },
    pip: { type: "boolean" },
    stopOnUnmount: { type: "boolean" },
    fallback: { type: "static_asset" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Video", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { width: "50vw", height: "50vh" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          stopOnUnmount: true,
          playbackRate: 1,
          progressInterval: 1000,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onPressEnter: [{ type: "do_nothing" }],
      onReady: [{ type: "do_nothing" }],
      onStart: [{ type: "do_nothing" }],
      onPlay: [{ type: "do_nothing" }],
      onPause: [{ type: "do_nothing" }],
      onBuffer: [{ type: "do_nothing" }],
      onBufferEnd: [{ type: "do_nothing" }],
      onEnded: [{ type: "do_nothing" }],
      onClickPreview: [{ type: "do_nothing" }],
      onEnablePIP: [{ type: "do_nothing" }],
      onDisablePIP: [{ type: "do_nothing" }],
      onError: [{ type: "do_nothing" }],
      onDuration: [{ type: "do_nothing" }],
      onSeek: [{ type: "do_nothing" }],
      onProgress: [{ type: "do_nothing" }],
      getCurrentTime: [{ type: "do_nothing" }],
      getSecondsLoaded: [{ type: "do_nothing" }],
      getDuration: [{ type: "do_nothing" }],
      getInternalPlayer: [{ type: "do_nothing" }],
      showPreview: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Video" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Video", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
